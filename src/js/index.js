import config from 'config';
import { Boards, Led } from 'johnny-five';
import Particle from 'particle-io';
import { connect } from 'mqtt';

const { usr, psw, clientId } = config.get('shiftr');

const boards = new Boards(config.get('boards').map((board) => {
	return {
		id: board.name,
		io: new Particle({
			token: config.get(`token`),
			deviceId: board.id
		})
	};
}));

const clients = config.get('boards').map((board) => {
	const { name } = board;
	const url = `mqtt://${usr}:${psw}@broker.shiftr.io`;
	const client = connect(url, { clientId: name });;
	return { name, client };
});

const getBoardByName = (name) => {
	let relevantBoard;
	boards.each((board) => {
		if (board.id === name) {
			relevantBoard = board;
		}
	});
	return relevantBoard;
};

const getClientByName = (name) => clients.filter((client) => client.name === name)[0];

const vogelitonBoard = getBoardByName('vogeliton');
const vogelitonClient = getClientByName('vogeliton');

const thonelinoBoard = getBoardByName('thonelino');
const thonelinoClient = getClientByName('thonelino');

let vogelitonLed;
let thonelinoLed;

let vogelitonInterval;
vogelitonClient.client.on('message', (topic, message) => {
	clearTimeout(vogelitonInterval);
	console.log(`vogeliton received a message: "${message.toString()}" on topic: ${topic}`);

	thonelinoLed.blink();
	vogelitonInterval = setTimeout(() => {
		vogelitonClient.client.publish('/inputs/thonelino', 'from vogeliton to thonelino');
		thonelinoLed.off();
	}, 3000);
});

let thonelinoInterval;
thonelinoClient.client.on('message', (topic, message) => {
	clearTimeout(thonelinoInterval);
	console.log(`thonelino received a message: "${message.toString()}" on topic: ${topic}`);

	thonelinoLed.blink();
	thonelinoInterval = setTimeout(() => {
		thonelinoClient.client.publish('/inputs/vogeliton', 'from thonelino to vogeliton');
		thonelinoLed.off();
	}, 3000);
});

vogelitonClient.client.on('connect', () => {
	vogelitonClient.client.subscribe('/inputs/vogeliton');
	vogelitonBoard.on('ready', () => {
		vogelitonLed = new Led({ pin: 'D7', board: vogelitonBoard });
		vogelitonClient.client.publish('/inputs/thonelino','from vogeliton to thonelino');
	});
});

thonelinoClient.client.on('connect', () => {
	thonelinoClient.client.subscribe('/inputs/thonelino');
	thonelinoBoard.on('ready', () => {
		thonelinoLed = new Led({ pin: 'D7', board: thonelinoBoard });
	});
});