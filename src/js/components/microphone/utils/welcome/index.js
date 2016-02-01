import config from 'config';
import fs from 'fs';
import Microphone from './../../../microphone';
import Record from './../records';
import SoundOutput from './../output';
import SpeechToText from './../speechtotext';
import terminal from 'oh-my-terminal';

export default class Welcome {
	startRecording(callback) {
		return new Promise((resolve, reject) => {
			const recordingOptions = this.getAudioData.bind(this)();
			const startRecord = new Record();

			startRecord.recordMaster(recordingOptions)
				.then(() => {
					this.convertSpeech.bind(this)()
						.then(resolve);
				})
				.catch(reject);
		});
	}
	getAudioData() {
		const {
			location,
			filename,
			sampleRate,
			maxRecordingTime,
			temp,
			master
		} = config.get('Audio');

		return { filename, location, sampleRate, maxRecordingTime, temp, master };

	}
	convertSpeech() {
		return new Promise((resolve, reject) => {
			const { azure } = config.get('APIKeys');

			const textLocation = config.get('Convert.location');
			const textFilename = config.get('Convert.filename');
			const audioLocation = config.get('Audio.location');
			const audioFilename = config.get('Audio.temp');

			const pathToText = `${textLocation}${textFilename}`;
			const pathToAudio = `${audioLocation}${audioFilename}.wav`;

			let speechToText = new SpeechToText();

			speechToText.getAccessToken('azureApp', azure, (accessTokenError, accessToken) => {
				if (accessTokenError) {
					reject(accessTokenError);
				}

				speechToText.convert(pathToAudio, accessToken, (speechToTextError, speechToTextResponse) => {
					if (speechToTextError) {
						reject(speechToTextError);
					}

					let textOutput = speechToTextResponse.results[0].lexical; // result of written text from audio
					fs.writeFile(pathToText, textOutput, (writeErr) => {
						if (writeErr) {
							reject(writeErr);
						}
						let voiceOutput = new SoundOutput();

						let message = `Sie haben die Sprache ${textOutput} gewählt! Bitte sprechen Sie jetzt!`;
						voiceOutput.say('Markus', message)
							.then(() => {
								resolve(textOutput);
							})
							.catch(reject);
					});
				});
			});
		});
	}
}
