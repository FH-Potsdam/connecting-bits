'use strict';

var _config = require('config');

var _config2 = _interopRequireDefault(_config);

var _johnnyFive = require('johnny-five');

var _particleIo = require('particle-io');

var _particleIo2 = _interopRequireDefault(_particleIo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var boards = new _johnnyFive.Boards([{
	id: 'vogeliton',
	io: new _particleIo2.default({
		token: _config2.default.get('token'),
		deviceId: _config2.default.get('boards.vogeliton.id')
	})
}, {
	id: 'thonelino',
	io: new _particleIo2.default({
		token: _config2.default.get('token'),
		deviceId: _config2.default.get('boards.thonelino.id')
	})
}, {
	id: 'pajaro',
	io: new _particleIo2.default({
		token: _config2.default.get('token'),
		deviceId: _config2.default.get('boards.pajaro.id')
	})
}]);

boards.on('ready', function () {
	this.each(function (board) {
		var led = new _johnnyFive.Led({ pin: 'D7', board: board });
		led.stop().blink();
	});
});