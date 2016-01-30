// thanks to: https://gist.github.com/lukehoban/0ee5c1bef438dc5bd7cb
import config from 'config';
import fs from 'fs';
import Record from './utils/records';
import Report from './utils/reports';

/**
 * @class Manages the Recording
 */
export default class Microphone {
	/**
	 * Writes a report file for the audi recoring
	 * @param  {Number} index
	 * @private
	 */
	reportAudio(index) {
		const { location, filename } = config.get('Report');
		const data = this.getAudioData.bind(this)(index);
		const newReport = new Report(location, filename, data);

		if (!fs.existsSync(location + filename)) {
			newReport.writeJSON();
		} else {
			newReport.extendJSON();
		}
	}
	/**
	 * Retrieves the relevant audio report
	 * @param  {Number} index
	 * @private
	 */
	getAudioData(index) {
		const {
			location,
			filename,
			sampleRate,
			maxRecordingTime
		} = config.get('Audio');

		const id = index;
		const recordingDate = new Date();

		return { filename, id, location, sampleRate,
			maxRecordingTime, recordingDate };
	}
	/**
	 * Start recording
	 * @param  {Function} callback
	 * @public
	 */
	startRecording(callback) {
		const { location, filename } = config.get('Report');
		const filePath = location + filename;
		let index = 0;

		if (fs.existsSync(filePath)) {
			let contents = fs.readFileSync(filePath);
			let jsonContent = JSON.parse(contents);

			index = jsonContent.results.length;
		}

		const recordingOptions = this.getAudioData(index);
		recordingOptions.language = 'german';

		const startRecord = new Record(recordingOptions, this.reportAudio.bind(this));
	}
}

