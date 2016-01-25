import fs from 'fs';
import rec from 'node-record-lpcm16';

export default class Record {
	constructor( options, callback ) {
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
		rec.start({ sampleRate, verbose: true }).pipe(file);

		setTimeout(() => {
			rec.stop();
			callback();
		}, options.maxRecTime);
	}
}
