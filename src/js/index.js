import config from 'config';
import { Board, Led } from 'johnny-five';
import Particle from 'particle-io';

const createBoard = (boardName) => {
	return new Board({
		io: new Particle({
			token: config.get(`token`),
			deviceId: config.get(`boards.${boardName}.id`)
		})
	});
};

const vogeliton = createBoard('vogeliton');
const pajaro = createBoard('pajaro');
const thonelino = createBoard('thonelino');

vogeliton.on('ready', function() {
	const led = new Led('D7');
	this.repl.inject({
		led: led
	});
	led.blink();
});
thonelino.on('ready', function() {
	const led = new Led('D7');
	this.repl.inject({
		led: led
	});
	led.blink();
});
pajaro.on('ready', function() {
	const led = new Led('D7');
	this.repl.inject({
		led: led
	});
	led.blink();
});
