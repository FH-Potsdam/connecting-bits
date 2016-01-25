import { Led } from 'johnny-five';
import config from 'config';
import Translator from '../translation';
import logUtil from '../../utils/logUtil';

class Box {
	constructor(board, client, options) {
		this.board = board;
		this.client = client;
		this.options = options;
		this.name = this.board.id;

		client.on('connect', this.onConnect.bind(this));
		client.on('message', this.onMessage.bind(this));
	}
	getReady() {
		const translator = new Translator();
		const { sensor } = config.get('Dev');

		if( sensor == 1 ) {
			setTimeout(translator.startRecording, 2000);
		} else {
			logUtil.log({
				type: 'warning',
				title: `Sensor not active!`
			})
		}
	}
	onConnect() {
		logUtil.log({
			type: 'shiftr',
			title: `Box "${this.name}" initialized`,
			messages: [ { topic: `/inputs/${this.name}` } ]
		})
		this.client.subscribe(`/inputs/${this.name}`);
		this.board.on('ready', this.onBoardReady.bind(this));
	}
	onMessage(topic, message) {
		clearTimeout(this.interval);
		logUtil.log({
			type: 'shiftr',
			title: `Box "${this.name}" received a message`,
			messages: [
				{ topic },
				{ message: message.toString() }
			]
		})

		this.led.blink();
		this.interval = setTimeout(this.forwardMessage.bind(this), 5000);
	}
	forwardMessage() {
		this.led.stop().off();
		if (!this.options.next) { return; }

		const topic = `/inputs/${this.options.next}`;
		const message = `from ${this.name} to ${this.options.next}`;
		logUtil.log({
			type: 'shiftr',
			title: `Box "${this.name}" forwarded a message`,
			messages: [
				{ from: this.name },
				{ to: this.options.next },
				{ topic },
				{ message }
			]
		})
		this.client.publish(topic, message);
	}
	onBoardReady(){
		logUtil.log({
			type: 'hardware',
			title: `Box's board of "${this.name}" is ready`
		})
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