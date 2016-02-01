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
			const jsonContent = JSON.parse(contents);
			const { language, output } = jsonContent;
			jsonContent.filePath = filePath;
			if (language.toLowercase() === 'deutsch') {
				this.translate.bind(this)('de', 'en', output)
					.then(resolve)
					.catch(reject);
			}
		});
	}
	translate(sourceLanguage, targetLanguage, output) {
		return new Promise((resolve, reject) => {
			const api_key = config.get('APIKeys.google');
			return fetch(`https://www.googleapis.com/language/translate
				/v2?key=${this.api_key}&q=${output}
				&source=${sourceLanguage}&target=${targetLanguage}`.trim())
				.then(res => res.json())
				.then(jsonContent => {
					const { location, filename } = config.get('Convert');
					const filePath = location + filename;
					const content = JSON.stringify({ language: targetLanguage, output });
					fs.writeFileSync(filePath, content, (writeError) => {
						if (writeError) {
							reject(writeError);
							return;
						}
						resolve();
					});
				});
		});
	}
}
