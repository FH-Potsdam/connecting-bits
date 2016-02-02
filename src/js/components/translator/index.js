import config from 'config';
import fs from 'fs';
const fetch = require('node-fetch');

/**
 * @class Class to translate audio texts into other languages
 */
export default class Translate {
	/**
	 * Class's constructor. Is called when initialized with the new keyword.
	 * @param  {String} name     - The Box's name to give the translation a name
	 * @param  {String} language - The Box's language to know from what language to translate
	 */
	constructor(name, language) {
		/**
		 * The Box's name to give the translation a name
		 * @type {String}
		 */
		this.name = name;
		/**
		 * The Box's language to know from what language to translate
		 * @type {String}
		 */
		this.language = language;
	}
	/**
	 * To be called to translate the audio text from on Box's language
	 * to the next neighbour's language
	 * @param  {Object} next - The next neighbour's config
	 * @return {Promise}     - Is done when the translation is successful
	 */
	translateNext(next) {
		return new Promise((resolve, reject) => {
			const texts = this.getTexts.bind(this)().texts;

			this.translate.bind(this)(this.language, next.language, texts[this.name].output)
				.then((response) => {
					this.addTranslation.bind(this)(response)
						.then(resolve);
				})
				.catch(reject);
		});
	}
	/**
	 * Generic translate function
	 * @param  {Stirng} sourceLanguage - The language to translate from
	 * @param  {Stirng} targetLanguage - The language to translate to
	 * @param  {Stirng} output         - The message to translate
	 * @return {Promise}               - Is called when the translation is over
	 */
	translate(sourceLanguage, targetLanguage, output) {
		return new Promise((resolve, reject) => {
			const api_key = config.get('APIKeys.google');
			const url = 'https://www.googleapis.com/language/translate' +
				`/v2?key=${api_key}&q=${output}` +
				`&source=${sourceLanguage}&target=${targetLanguage}`;

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
	/**
	 * Retrives the texts save in the file
	 * @return {Object} - With the file path and the texts
	 */
	getTexts() {
		const { location, filename } = config.get('Convert');
		const filePath = location + filename;
		const contents = fs.readFileSync(filePath);
		const texts = JSON.parse(contents).texts;
		return { filePath, texts };
	}
	/**
	 * Adds a new translation to the texts file
	 * @param {Promise} response - Is done when the new translation is insterd in the file
	 */
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
