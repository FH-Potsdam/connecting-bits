'use strict';

var config = require('config');

var _require = require('johnny-five');

var Board = _require.Board;
var Led = _require.Led;

var Particle = require('particle-io');

var createBoard = function createBoard(boardName) {
	return new Board({
		io: new Particle({
			token: config.get(boardName + '.token'),
			deviceId: config.get(boardName + '.id')
		})
	});
};

var blinkLedD7 = function blinkLedD7() {
	var led = new Led('D7');
	led.blink();
};

var board1 = createBoard('board1');
var board2 = createBoard('board2');
board1.on('ready', blinkLedD7);
board2.on('ready', blinkLedD7);