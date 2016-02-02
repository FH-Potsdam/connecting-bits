import fs from 'fs';
import rec from 'node-record-lpcm16';

/**
 * @class Handling the audio recording, specially the wav files
 */
export default class Record {
	/**
	 * Records the audio and writes the input into a temp file
	 * @param  {Object}   options  - The Recording options
	 * @param  {Function} callback - The function to be called when over
	 */
	recordMaster(options, callback) {
		const {
			location,
			filename,
			id,
			sampleRate,
			temp,
			master,
			maxRecordingTime
		} = options;

		const file = fs.createWriteStream(
			`${location}${temp}.wav`, {
				encoding: 'binary'
			});
		rec.start({ sampleRate, verbose: true });

		const timeout = setTimeout(() => {
			rec.stop().pipe(file);
			callback();
			clearTimeout(timeout);
		}, maxRecordingTime);
	}
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
