import fs from 'fs';
import rec from 'node-record-lpcm16';

/**
 * @class Handling the audio recording, specially the wav files
 */
export default class Record {
	/**
	 * Records the input in a wav file
	 * @param  {Object} options - The recording options
	 * @return {Promise}        - Is called when recorded and written in a file
	 */
	recordInput(options) {
		return new Promise((resolve, reject) => {
			const {
				location,
				filename,
				id,
				sampleRate,
				maxRecordingTime
			} = options;

			const file = fs.createWriteStream(
				`${location}${filename}.wav`, {
					encoding: 'binary'
				});
			rec.start({ sampleRate, verbose: true });

			const timeout = setTimeout(() => {
				rec.stop().pipe(file);
				clearTimeout(timeout);
				resolve(id);
			}, maxRecordingTime);
		});
	}
}
