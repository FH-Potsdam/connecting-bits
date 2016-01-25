import chalk from 'chalk';

const PREFIX_TABULATION = `
            `;

const cammelize = (str) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
    if (+match === 0) return '';
    return index == 0 ? match.toLowerCase() : match.toUpperCase();
  });
}

const getFormattedTime = () => {
	const time = new Date();
	const timeFormatted = ("0" + time.getHours()).slice(-2) + ":" +
	    ("0" + time.getMinutes()).slice(-2) + ":" +
	    ("0" + time.getSeconds()).slice(-2);
	return '\n' +
		chalk.white('[') +
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
	const { type, title, messages} = options;
	const color = getColorByType(type);
	const bgColor = cammelize('bg ' + color);
	const toLog = [getFormattedTime()];
	if (title && typeof title === 'string') {
		toLog.push(chalk.bold.white[bgColor](title));
	}
	messages.forEach((message) => {
		toLog.push(chalk[color](PREFIX_TABULATION + message));
	});
	toLog.push('\n');
	console.log.apply(console, toLog);
};

module.exports = {
	log: (messageOrOptions) => {
	const { type, title, messages} = messageOrOptions;
		if (typeof messageOrOptions === 'object' &&
			(type || title || messages)) {
			const options = Object.assign({}, {
				type: false,
				title: false,
				messages: []
			}, messageOrOptions);
			doLog(options);
		}
		else {
			doLog({
				type: false,
				title: false,
				messages: messageOrOptions
			});
		}
	}
};