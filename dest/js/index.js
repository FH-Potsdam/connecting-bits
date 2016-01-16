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
			token: _config2.default.get('token'),
			deviceId: _config2.default.get('boards.' + boardName + '.id')
		})
	});
};

var vogeliton = createBoard('vogeliton');
var pajaro = createBoard('pajaro');
var thonelino = createBoard('thonelino');

vogeliton.on('ready', function () {
	var led = new _johnnyFive.Led('D7');
	this.repl.inject({
		led: led
	});
	led.blink();
});
thonelino.on('ready', function () {
	var led = new _johnnyFive.Led('D7');
	this.repl.inject({
		led: led
	});
	led.blink();
});
pajaro.on('ready', function () {
	var led = new _johnnyFive.Led('D7');
	this.repl.inject({
		led: led
	});
	led.blink();
});