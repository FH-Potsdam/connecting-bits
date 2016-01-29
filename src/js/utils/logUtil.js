import chalk from 'chalk';

const PREFIX_TABULATION = `
		   `; // Do not refactor. Intended line break and spaces

const getFormattedTime = () => {
	const time = new Date();
	const timeFormatted = ('0' + time.getHours()).slice(-2) +
		':' + ('0' + time.getMinutes()).slice(-2) +
		':' + ('0' + time.getSeconds()).slice(-2);
	return chalk.white('[') +
		chalk.gray(timeFormatted) +
		chalk.white('] ');
};

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

module.exports = {
	log: (messageOrOptions) => {
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
};
