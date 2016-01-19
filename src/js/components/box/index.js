import { Led } from 'johnny-five';

class Box {
	constructor(board, client, options) {
		this.board = board;
		this.client = client;
		this.options = options;
		this.name = this.board.id;

		client.on('connect', this.onConnect.bind(this));
		client.on('message', this.onMessage.bind(this));
	}
	onConnect() {
		console.log(`${this.name} is connected`);
		this.client.subscribe(`/inputs/${this.name}`);
		this.board.on('ready', this.onBoardReady.bind(this));
	}
	onMessage(topic, message) {
		clearTimeout(this.interval);
		console.log(`${this.name} received a message:`,
			`"${message.toString()}" on topic: ${topic}`);

		this.led.blink();
		this.interval = setTimeout(this.forwardMessage.bind(this), 5000);
	}
	forwardMessage() {
		this.led.stop().off();
		if (!this.options.next) { return; }
		console.log(`${this.name} forwarded the message to ${this.options.next}`);
		const topic = `/inputs/${this.options.next}`;
		const message = `from ${this.name} to ${this.options.next}`;
		this.client.publish(topic, message);
	}
	onBoardReady(){
		console.log(`${this.name}'s board is ready`);
		this.led = new Led({ pin: 'D7', board: this.board });
	}
	getClient() {
		return this.client;
	}
	getBoard() {
		return this.board;
	}
}

module.exports = Box;