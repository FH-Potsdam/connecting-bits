import fs from 'fs';
import logUtil from '../../../../utils/logUtil';

/**
 * @class Manages the audio reports
 */
export default class CreateReport {
	/**
	 * @param  {String} location
	 * @param  {String} filename
	 * @param  {Object} data
	 */
	constructor(location, filename, data) {
		this.writeJSON.bind(this);
		this.extendJSON.bind(this);

		/**
		 * Audio data
		 * @type {Object}
		 */
		this.data = data;
		/**
		 * Complete file path
		 * @type {String}
		 */
		this.filePath = `${location}${filename}`;

		/**
		 * New audio report config
		 * @type {Object}
		 */
		this.newObject = { results: [] };
		this.newObject.results.push(data);

		logUtil.log({
			type: 'info',
			title: 'Audio report initialized'
		});
	}
	/**
	 * Writes an audio report in a json file
	 * @public
	 */
	writeJSON() {
		fs.writeFileSync(this.filePath, JSON.stringify(this.newObject));
		logUtil.log({
			type: 'info',
			title: 'New audio JSON-file written'
		});
	}
	/**
	 * Extends the audio report in an existing json file
	 * @public
	 */
	extendJSON() {
		let contents = fs.readFileSync(this.filePath);
		let jsonContent = JSON.parse(contents);

		jsonContent.results.push(this.data);
		fs.writeFileSync(this.filePath, JSON.stringify(jsonContent));
		logUtil.log({
			type: 'info',
			title: 'Audio JSON-file extended'
		});
	}
}
