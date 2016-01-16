'use strict';

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _johnnyFive = require('johnny-five');

var _particleIo = require('particle-io');

var _particleIo2 = _interopRequireDefault(_particleIo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createBoard = function createBoard(boardName) {
	return new _johnnyFive.Board({
		io: new _particleIo2.default({
			token: _config2.default.get(boardName + '.token'),
			deviceId: _config2.default.get(boardName + '.id')
		})
	});
};

var blinkLedD7 = function blinkLedD7() {
	var led = new _johnnyFive.Led('D7');
	led.blink();
};

var board1 = createBoard('board1');
var board2 = createBoard('board2');
board1.on('ready', blinkLedD7);
board2.on('ready', blinkLedD7);