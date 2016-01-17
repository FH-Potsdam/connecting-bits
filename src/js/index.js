import config from 'config';
import { Boards, Led } from 'johnny-five';
import Particle from 'particle-io';
import { connect } from 'mqtt';

const { usr, psw, clientId } = config.get('shiftr');
const client = connect(`mqtt://${usr}:${psw}@broker.shiftr.io`, { clientId });

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
	},
	{
		id: 'cuco',
		io: new Particle({
			token: config.get(`token`),
			deviceId: config.get(`boards.cuco.id`)
		})
	}
]);

boards.on('ready', function() {
	this.each((board) => {
		const led = new Led({ pin: 'D7', board });
		led.stop().blink();
	});
});

client.on('connect', function(){
	console.log('client has connected!');

	client.subscribe('/example');
	// client.unsubscribe('/example');

	setInterval(function(){
		client.publish('/hello', 'world');
	}, 1000);
});

client.on('message', function(topic, message) {
	console.log('new message:', topic, message.toString());
});
