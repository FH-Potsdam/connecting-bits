import fs from 'fs';
import config from 'config';

/**
 * @class Hangling the audio reports
 */
export default class CreateReport {
	/**
	 * The class's constructor. Is called when initialized.
	 * @param  {String} data - The audio file's data (wav)
	 */
	constructor(data) {
		/**
		 * The dataa of the audio record
		 * @type {String}
		 */
		this.data = data;

		/**
		 * The new audio report
		 * @type {Object}
		 */
		this.newObject = { results: [] };
		this.newObject.results.push(data);
	}
	/**
	 * Overrides a json report in a relevant file
	 * @return {Promise} - Is done when the report is overriden
	 */
	writeJSON() {
		return new Promise((resolve, reject) => {
			const { location, filename } = config.get('Report');
			const filePath = `${location}${filename}`;
			fs.writeFile(filePath, JSON.stringify(this.newObject), (writeError) => {
				if (writeError) {
					reject(writeError);
					return;
				}
				resolve();
			});
		});
	}
	/**
	 * Extends an existing audio report
	 * @return {Promise} - Is done when the report is extended
	 */
	extendJSON() {
		return new Promise((resolve, reject) => {
			const { location, filename } = config.get('Report');
			const filePath = `${location}${filename}`;
			let contents = fs.readFileSync(filePath);
			let jsonContent = JSON.parse(contents);

			jsonContent.results.push(this.data);
			fs.writeFile(filePath, JSON.stringify(jsonContent), (writeError) => {
				if (writeError) {
					reject(writeError);
					return;
				}
				resolve();
			});
		});
	}
}
