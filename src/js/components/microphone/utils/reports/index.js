import fs from 'fs';
import logUtil from '../../../../utils/logUtil';

export default class CreateReport {
	constructor(location, filename, data) {
		this.writeJSON.bind(this);
		this.extendJSON.bind(this);

		this.data = data;
		this.filePath = `${location}${filename}`;

		this.newObject = { results: [] };
		this.newObject.results.push(data);

		logUtil.log({
			type: 'info',
			title: 'Audio report initialized'
		});
	}
	writeJSON() {
		fs.writeFileSync(this.filePath, JSON.stringify(this.newObject));
		logUtil.log({
			type: 'info',
			title: 'New audio JSON-file written'
		});
	}
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
