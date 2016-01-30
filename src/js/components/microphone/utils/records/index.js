import fs from 'fs';
import rec from 'node-record-lpcm16';

/**
 * @class Manages the audio recording
 */
export default class Record {
	/**
	 * Records and writes the audio in a wav file
	 * @param  {Object} options
	 * @param  {Function} callback
	 */
	constructor(options, callback) {
		const {
			location,
			filename,
			id,
			sampleRate
		} = options;

		const file = fs.createWriteStream(
			`${location}${filename}${id}.wav`, {
				encoding: 'binary'
			});
		rec.start({ sampleRate, verbose: true });

		setTimeout(() => {
			rec.stop().pipe(file);
			callback();
		}, options.maxRecordingTime);
	}
}
