import config from 'config';
import { Board, Led } from 'johnny-five';
import Particle from 'particle-io';

const createBoard = (boardName) => {
	return new Board({
		io: new Particle({
			token: config.get(`${boardName}.token`),
			deviceId: config.get(`${boardName}.id`)
		})
	});
};

const blinkLedD7 = () => {
	const led = new Led('D7');
	led.blink();
};

const board1 = createBoard('board1');
const board2 = createBoard('board2');
board1.on('ready', blinkLedD7);
board2.on('ready', blinkLedD7);