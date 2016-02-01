import terminal from 'oh-my-terminal';
import fs from 'fs';
import config from 'config';

export default class SoundOutput {
	constructor(name, language) {
		this.name = name;
		this.language = language;
	}
	speakText() {
		return new Promise((resolve) => {
			const voice = this.getVoiceByLanguage.bind(this)(this.language);
			const { location, filename } = config.get('Convert');
			const filePath = `${location}${filename}`;
			const contents = fs.readFileSync(filePath);
			const jsonContent = JSON.parse(contents);
			const text = jsonContent.texts[this.name].output;
			this.say.bind(this)(voice, text)
				.then(resolve);
		});
	}
	say(voice, message) {
		return new Promise((resolve, reject) => {
			// change var to trans text
			let output = `say -v "${voice}" ${message}`;
			terminal.exec(output, (err) => {
				if (err) {
					reject(err);
					return;
				}
				resolve();
			});
		});
	}
	tellRules() {
		return new Promise((resolve, reject) => {
			this.say.bind(this)('Anna', 'Drei. Zwei. Eins. Los gehts baby!')
				.then(resolve);
		});
	}
	getVoiceByLanguage(language) {
		switch (language) {
			case 'de':
				return 'Anna';
			case 'en':
				return 'Lee';
			case 'fr':
				return 'Aurelie';
			default:
				return 'Lee';
		}
	}
}
