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
		rec.start({ sampleRate, verbose: true });

		setTimeout(() => {
			rec.stop().pipe(file);
			callback();
		}, options.maxRecordingTime);
	}
}
