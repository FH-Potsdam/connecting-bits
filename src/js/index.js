import config from 'config';
import { Boards, Led } from 'johnny-five';
import Particle from 'particle-io';

const boards = new Boards([
	{
		id: 'vogeliton',
		io: new Particle({
			token: config.get(`token`),
			deviceId: config.get(`boards.vogeliton.id`)
		})
	},
	{
		id: 'thonelino',
		io: new Particle({
			token: config.get(`token`),
			deviceId: config.get(`boards.thonelino.id`)
		})
	},
	{
		id: 'pajaro',
		io: new Particle({
			token: config.get(`token`),
			deviceId: config.get(`boards.pajaro.id`)
		})
	}
]);

boards.on('ready', function() {
	this.each((board) => {
		const led = new Led({ pin: 'D7', board });
		led.stop().blink();
	});
});
