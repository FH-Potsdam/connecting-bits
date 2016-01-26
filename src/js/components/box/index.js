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
		this.round = 0;

		// initialise subcomponents
		this.translator = new Translator();
		this.light = new Light();
		this.motor = new Motor();
		this.speaker = new Speaker();
		this.infrared = new Infrared();
		this.microphone = new Microphone();

		client.on('connect', this.onConnect.bind(this));
		client.on('message', this.onMessage.bind(this));
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

		switch(message.toString()) {
			case 'done':
				this.startTheShow.bind(this)();
			break;
			case 'readyToSpeak':
				this.onPreviousBoxSpeaking.bind(this);
			break
		}
	}
	forwardMessage(message) {
		this.led.stop().off();
		if (!this.options.next) { return; }

		const topic = `/inputs/${this.options.next}`;
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
	start() {
		this.motor.lieDown()
			.then(() => {
				this.infrared.detectPresence()
					.then(this.onPresenceDetected.bind(this))
					.catch(this.startTheShow.bind(this));
			});
	}
	startTheShow() {
		this.round++;
		this.start.bind(this);
	}
	onPresenceDetected() {
		this.motor.stadUp()
			.then(() => {
				this.light.startBlinking();
				this.speaker.explainRules()
					.then(this.onRulesExplained.bind(this));
			})
	}
	onRulesExplained() {
		this.motor.lookUp()
			.then(() => {
				this.microphone.startRecording()
					.then(this.onRecordingSuccess.bind(this))
					.catch(this.onRecordingFailed.bind(this));
			});
	}
	onRecordingSuccess() {
		this.forwardMessage.bind(this)('readyToSpeak');
		this.light.stopBlinking();
		this.motor.lookStraight()
			.then(() => {
				this.speaker.speakText()
					.then(this.onTextSpoken.bind(this);
			})
	}
	onRecordingFailed() {
		this.motor.lookStraight()
			.then(() => {
				this.speaker.sayNoRecordingError()
					.then(this.startTheShow.bind(this));
			});
	}
	onTextSpoken() {
		if (this.options.isMaster) {
			if (this.round === 1) {
				this.translator.translateText()
					.then(this.finish.bind(this))
			}
			else {
				this.round = 0;
				this.startTheShow.bind(this)();
			}
		}
		else {
			this.finish.bind(this)();
		}
	}
	finish() {
		this.forwardMessage.bind(this)('done');
		this.motor.lieDown();
	}
	onPreviousBoxSpeaking() {
		this.motor.standUp();
			.then(() => {
				this.motor.lookUp()
				this.light.startBlinking();
			});
	}
}

module.exports = Box;