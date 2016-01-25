// thanks to: https://gist.github.com/lukehoban/0ee5c1bef438dc5bd7cb
import config from 'config';
import fs from 'fs';
import Record from './utils/records';
import Report from './utils/reports';

export default class Translator {
	constructor() {
		reportAudio.bind(this);
		getAudioData.bind(this);
		startRecording.bind(this);
	}
	reportAudio(index) {
		const { location, filename } = config.get('Report');
		const data = this.getAudioData(index);
		const newReport = new Report(location, filename, data);

		if (!fs.existsSync(location + filename)) {
			newReport.writeJSON();
		} else {
			newReport.extendJSON();
		}
	}
	getAudioData(index) {
		const {
			location,
			filename,
			sampleRate,
			maxRecordingTime
		} = config.get('Audio');

		const id = index;
		const recordingDate = new Date();

		return { filename, id, location, samplerate,
			maxRecordTime, recordingDate };
	}
	startRecording(callback){
		const { location, filename } = config.get('Report');
		const filePath = location + filename;
		let index = 0;

		if (fs.existsSync(filePath)) {
			let contents = fs.readFileSync(filePath);
			let jsonContent = JSON.parse(contents);

			for( let i = 0; i < Object.keys(jsonContent.results).length; i++ ) {
				index = i;
			}
		}

		const recordingOptions = this.getAudioData(index);
		recordingOptions.language = 'german';

		const startRecord = new Record(recordingOptions, this.reportAudio(index));
	}
};
