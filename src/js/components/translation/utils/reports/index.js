import fs from 'fs';

export default class CreateReport {
	constructor(location, filename, data) {
		this.data = data;
		this.filePath = `${location}${filename}`;

		this.newObject = { results: [] };
		this.newObject.results.push(data);

		console.log('Report initialized');
	}
	writeJSON() {
		fs.writeFileSync(this.filePath, JSON.stringify(this.newObject));
		console.log('new JSON-file written');
	}
	extendJSON() {
		let contents = fs.readFileSync(this.filePath);
		let jsonContent = JSON.parse(contents);

		jsonContent['results'].push(this.data);
		fs.writeFileSync(this.filePath, JSON.stringify(jsonContent));
		console.log('JSON-file extended');
	}
}
