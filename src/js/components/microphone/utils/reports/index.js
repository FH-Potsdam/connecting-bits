import fs from 'fs';
import config from 'config';

export default class CreateReport {
	constructor(data) {
		this.data = data;

		this.newObject = { results: [] };
		this.newObject.results.push(data);
	}
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
