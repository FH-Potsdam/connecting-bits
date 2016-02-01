import config from 'config';
import fs from 'fs';
import Record from './utils/records';
import SoundOutput from './utils/output';
import Report from './utils/reports';
import SpeechToText from './utils/speechtotext';
import Translate from './../translator';
import logUtil from '../../utils/logUtil';

export default class Microphone {
	constructor(name, language) {
		this.name = name;
		this.language = language;
	}
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
					if (speechToTextError) {
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
