import fs from 'fs';
import rec from 'node-record-lpcm16';

export default class Record {
	constructor() {
		this.recordMaster = this.recordMaster.bind(this);
		this.recordInput = this.recordInput.bind(this);
	}

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
