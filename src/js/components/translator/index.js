import config from 'config';
import fs from 'fs';
const fetch = require('node-fetch');

export default class Translate {
	constructor(name, language) {
		this.name = name;
		this.language = language;
	}
	translateNext(next) {
		return new Promise((resolve, reject) => {
			const texts = this.getTexts.bind(this)().texts;

			console.log(texts[this.name].output);
			this.translate.bind(this)(this.language, next.language, texts[this.name].output)
				.then((response) => {
					this.addTranslation.bind(this)(response)
						.then(resolve);
				})
				.catch(reject);
		});
	}
	translate(sourceLanguage, targetLanguage, output) {
		return new Promise((resolve, reject) => {
			const api_key = config.get('APIKeys.google');
			const url = 'https://www.googleapis.com/language/translate' +
				`/v2?key=${api_key}&q=${output}` +
				`&source=${sourceLanguage}&target=${targetLanguage}`;
			console.log(url);
			fetch(url)
				.then(res => res.json())
				.then(jsonContent => {
					resolve({ language: targetLanguage, output: jsonContent });
				})
				.catch((translationError) => {
					reject(translationError);
				});
		});
	}
	getTexts() {
		const { location, filename } = config.get('Convert');
		const filePath = location + filename;
		const contents = fs.readFileSync(filePath);
		const texts = JSON.parse(contents).texts;
		return { filePath, texts };
	}
	addTranslation(response) {
		return new Promise((resolve, reject) => {
			const { texts, filePath } = this.getTexts.bind(this)();
			texts[this.next.name] = response;
			const jsonToSave = { texts: jsonToSave };
			fs.writeFile(filePath, JSON.stringify(jsonToSave), (writeError) => {
				if (writeError) {
					reject(writeError);
				}
				resolve();
			});
		});
	}
}
