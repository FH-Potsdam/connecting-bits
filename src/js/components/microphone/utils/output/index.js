import terminal from 'oh-my-terminal';
import fs from 'fs';
import config from 'config';

/**
 * @class Transforms text into speech
 */
export default class SoundOutput {
	/**
	 * Has to be initialize with board information such as
	 * @param  {String} name     - Box's name for fiding the relevant text
	 * @param  {String} language - Box's language to find the right voice
	 */
	constructor(name, language) {
		/**
		 * Box's name
		 * @type {String}
		 */
		this.name = name;
		/**
		 * Box's laguage
		 * @type {String}
		 */
		this.language = language;
	}
	/**
	 * Finds the relevant text in the file saved by the microphone component
	 * and speaks it out loud
	 * @return {Promise} - Is done when the whole text has been spoken out loup
	 */
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
	/**
	 * Generic function speaking any text out loud with a given voice
	 * @param  {String} voice   - Any OSX preconfigured voice
	 * @param  {String} message - Text to be spoken out loud
	 * @return {Promise}        - Is done when the text is completly recited
	 */
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
	/**
	 * Explains the rules of the game
	 * @return {Promise} - Is done when all rules are told
	 */
	explainRules() {
		return new Promise((resolve, reject) => {
			this.say.bind(this)('Anna', 'Drei. Zwei. Eins. Los gehts baby!')
				.then(resolve);
		});
	}
	/**
	 * Find the relevant OSX voice by language
	 * @param  {String} language - The wished language's voice (alpha2 code)
	 * @return {String}          - The relevant voice for the given language
	 */
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
