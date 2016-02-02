import config from 'config';
import fs from 'fs';
import Record from './utils/records';
import SoundOutput from './utils/output';
import Report from './utils/reports';
import SpeechToText from './utils/speechtotext';
import Translate from './../translator';
import logUtil from '../../utils/logUtil';

/**
 * A class managing the audio recording and turning soud into text
 */
export default class Microphone {
	/**
	 * Class's constructor. Is called when initialized with the "new" keyword.
	 * @param  {String} name     - Name of the box. Used to save the audio by Box name
	 * @param  {String} language - Language of the box. Used for speeching
	 *                             and translating it later on
	 * @return {[type]}          [description]
	 */
	constructor(name, language) {
		/**
		 * Name of the box. Used to save the audio by Box name
		 * @type {String}
		 */
		this.name = name;
		/**
		 * Language of the box. Used for speeching
		 * and translating it later on
		 * @type {String} In form of an alpha code
		 * @example
		 * de, fr, en, ar...
		 */
		this.language = language;
	}
	/**
	 * Records a voice, transforms the input into text and saves it
	 * @return {Promise} Is done when all operations are done
	 */
	startRecording() {
		return new Promise((resolve, reject) => {
			const { location, filename } = config.get('Report');
			const filePath = location + filename;
			let index = 0;

			if (fs.existsSync(filePath)) {
				let contents = fs.readFileSync(filePath);
				let jsonContent = JSON.parse(contents);
				index = jsonContent.results.length;
			}

			const recordingOptions = this.getAudioData.bind(this)(index);
			const startRecord = new Record();
			startRecord.recordInput(recordingOptions)
				.then((id) => {
					this.reportAudio.bind(this)(id)
						.then((data) => {
							this.convertSpeech.bind(this)(data)
								.then(resolve)
								.catch(reject);
						})
						.catch(reject);
				})
				.catch(reject);
		});
	}
	/**
	 * Retrieves all needed configs for the recording
	 * @param  {Number} index - Unique id for the record
	 * @return {Object}       - Each key is an indication
	 */
	getAudioData(index) {
		const {
			location,
			filename,
			sampleRate,
			maxRecordingTime,
			temp
		} = config.get('Audio');

		const id = index;
		const recordingDate = new Date();

		return {
			filename: filename + id,
			id, location, sampleRate,
			maxRecordingTime, recordingDate, temp
		};

	}
	/**
	 * Creates an audio report
	 * @param  {[Number} index - Id of the report
	 * @return {Promise}       - Is done when the report is written
	 */
	reportAudio(index) {
		return new Promise((resolve, reject) => {
			const data = this.getAudioData.bind(this)(index);
			const newReport = new Report(data);
			const { location, filename } = config.get('Report');
			const filePath = location + filename;

			if (!fs.existsSync(filePath)) {
				newReport.writeJSON()
					.then(() => resolve(data))
					.catch((writeError) => {
						reject(writeError);
					});
			} else {
				newReport.extendJSON()
					.then(() => {
						resolve(data);
					})
					.catch((writeError) => {
						reject(writeError);
					});
			}
		});
	}
	/**
	 * Converts the audio input into text
	 * @param  {[type]} audioData [description]
	 * @return {[type]}           [description]
	 */
	convertSpeech(audioData) {
		return new Promise((resolve, reject) => {
			const { azure } = config.get('APIKeys');
			const { location, filename } = config.get('Convert');
			const pathToText = `${location}${filename}`;
			const pathToAudio = `${audioData.location}${audioData.filename}.wav`;

			let speechToText = new SpeechToText();

			speechToText.getAccessToken('azureApp', azure, (accessTokenError, accessToken) => {
				if (accessTokenError) {
					reject(accessTokenError);
				}

				speechToText.convert(pathToAudio, accessToken, this.language, (speechToTextError, res) => {
					if (speechToTextError || !res) {
						if (!res) {
							reject(new Error('Speech to text failed'));
							return;
						}
						reject(speechToTextError);
					}

					let textOutput = res.results[0].lexical; // result of written text from audio
					let jsonToSave = {};
					let resultValue = {
						language: this.language,
						output: textOutput
					};
					let convertFile;
					if (!fs.existsSync(pathToText)) {
						convertFile = JSON.parse(fs.readFileSync(pathToText));
						jsonToSave = convertFile.texts[this.name] = resultValue;
					} else {
						jsonToSave[this.name] = resultValue;
						jsonToSave = { texts: jsonToSave };
					}
					fs.writeFile(pathToText, JSON.stringify(jsonToSave), (writeError) => {
						if (writeError) {
							reject(writeError);
						}
						resolve();
					});
				});
			});
		});
	}
}
