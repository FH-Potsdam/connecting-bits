import chalk from 'chalk';
/**
 * Prefix intended to add a line break an tabulations in the
 * log messages to align them to the title
 * !CAUTION¡ Do not refactor because it look bad. It is intended
 * to be so !CAUTION¡
 * @type {String}
 */
const PREFIX_TABULATION = `
		   `;

/**
 * Retrieves a formatted date like node does. Wraps the square
 * Brackets in a whote color with chalk to imitate the color
 * hilighting of oh-my-zsh
 * @private
 * @return {String}
 * @example
 * const date = getFormattedDate() // Outputs [12:27:57]
 */
const getFormattedTime = () => {
	const time = new Date();
	const timeFormatted = ('0' + time.getHours()).slice(-2) +
		':' + ('0' + time.getMinutes()).slice(-2) +
		':' + ('0' + time.getSeconds()).slice(-2);
	return chalk.white('[') +
		chalk.gray(timeFormatted) +
		chalk.white('] ');
};

/**
 * Maps logging types to colors for log hilighting
 * @private
 * @param  {String} type - Wether info, hardware, shiftr, error, warning or discrete
 * @return {String} The color associated to the type
 */
const getColorByType = (type) => {
	switch (type) {
		case 'info':
			return 'blue';
		case 'hardware':
			return 'magenta';
		case 'shiftr':
			return 'green';
		case 'error':
			return 'red';
		case 'warning':
			return 'orange';
		case 'discrete':
			return 'gray';
		default:
			return 'white';
	}
};

/**
 * Parses an obtion object and logs whatever is gived to him in the
 * relevant color.
 * @param  {Object} options
 * @private
 */
const doLog = (options) => {
	const { type, title, messages } = options;
	const color = getColorByType(type);
	const toLog = [ '\n' + getFormattedTime() ];
	if (title && typeof title === 'string') {
		toLog.push(chalk.inverse.bold[ color ](' ' + title + ' '));
	}
	messages.forEach((message) => {
		let formattedMessage = chalk[ color ](PREFIX_TABULATION, message);
		if (typeof message === 'object') {
			let key = Object.keys(message)[0];
			formattedMessage = chalk[ color ](PREFIX_TABULATION,
				' ' + chalk.underline(key + ':'), message[key]);
		}
		toLog.push(formattedMessage);
	});
	toLog.push('\n');
	console.log.apply(console, toLog);
};

/**
 * @class Utility for handling Logging
 */
export default class LogUtil {
	/**
	 * Log a formatted and hilighted message to the console
	 * @public
	 * @param  {String or Object} messageOrOptions - Wether a sing sting
	 * 												 or an object containing
	 * 												 title, type and/or messages
	 * @example
	 * log({
	 * 	type: 'hardware',
	 * 	title: 'Servo motor movement done',
	 * 	messages: [
	 * 		{ 'started from': 0 },
	 * 		{ 'Rotated to': 123 }
	 * 	]
	 * });
	 */
	static log(messageOrOptions) {
		const { type, title, messages } = messageOrOptions;
		if (typeof messageOrOptions === 'object' &&
			(type || title || messages)) {
			const options = Object.assign({}, {
				type: false,
				title: false,
				messages: []
			}, messageOrOptions);
			doLog(options);
		} else {
			doLog({
				type: false,
				title: false,
				messages: messageOrOptions
			});
		}
	}
}
