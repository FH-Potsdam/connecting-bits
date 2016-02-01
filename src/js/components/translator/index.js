import config from 'config';
import fs from 'fs';
const fetch = require('node-fetch');

export default class Translate {
	constructor(name, language) {
		this.name = name;
		this.language = language;
	}
	startTranslation() {
		return new Promise((resolve, reject) => {
			const { location, filename } = config.get('Convert');
			const filePath = location + filename;
			const contents = fs.readFileSync(filePath);
			const texts = JSON.parse(contents).texts;

			this.translate.bind(this)(this.language, 'fr', texts[this.name].output)
				.then(resolve)
				.catch(reject);
		});
	}
	translate(sourceLanguage, targetLanguage, output) {
		return new Promise((resolve, reject) => {
			const api_key = config.get('APIKeys.google');
			fetch(`https://www.googleapis.com/language/translate
				/v2?key=${this.api_key}&q=${output}
				&source=${sourceLanguage}&target=${targetLanguage}`.trim())
				.then(res => res.json())
				.then(jsonContent => {
					console.log(JSON.stringify(jsonContent));
					resolve({ language: targetLanguage, output: jsonContent });
				})
				.catch((translationError) => {
					console.log(translationError);
				});
		});
	}
}
