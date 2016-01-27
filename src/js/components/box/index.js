import { Led } from 'johnny-five';
import config from 'config';
// import Microphone from '../microphone'; // TODO: @Andre > Replace when implemented
import Microphone from '../dummyMicrophone';
import Translator from '../translator';
import Light from '../light';
import Motor from '../motor';
import Speaker from '../speaker';
import Infrared from '../infrared';
import logUtil from '../../utils/logUtil';

export default class Box {
	constructor(board, client, options) {
		this.board = board;
		this.client = client;
		this.options = options;
		this.name = this.board.id;
		this.round = 0;

		// initialise subcomponents
		this.translator = null;
		this.light = null;
		this.motor = null;
		this.speaker = null;
		this.infrared = null;
		this.microphone = null;

		client.on('connect', this.onConnect.bind(this));
		client.on('message', this.onMessage.bind(this));
	}
	onConnect() {
		logUtil.log({
			type: 'shiftr',
			title: `Box "${this.name}" connected and subscribed`,
			messages: [ { 'subscription topic': `/inputs/${this.name}` } ]
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
				this.round++;
				this.prepareToSpeak.bind(this)();
			break;
			case 'readyToListen':
				this.speakText.bind(this)();
			break;
			case 'readyToSpeak':
				this.onPreviousBoxSpeaking.bind(this)();
			break
		}
	}
	forwardMessage(message, recipient = 'next') {
		const recipientBox = this.options[recipient];
		if (!recipientBox) {
			logUtil.log({
				type: 'warning',
				title: `Box "${this.name}" has an invalid next sibling`,
				messages: [
					{ sibling: recipientBox.name }
				]
			});
		}

		const topic = `/inputs/${recipientBox.name}`;
		logUtil.log({
			type: 'shiftr',
			title: `Box "${this.name}" forwarded a message`,
			messages: [
				{ from: this.name },
				{ to: recipientBox.name },
				{ topic },
				{ message }
			]
		})
		this.client.publish(topic, message);
	}
	onBoardReady(){
		this.translator = new Translator();
		this.speaker = new Speaker();
		this.microphone = new Microphone();
		this.light = new Light(this.board);
		this.motor = new Motor(this.board);
		this.infrared = new Infrared(this.board);
		logUtil.log({
			type: 'hardware',
			title: `Box's board of "${this.name}" is ready`
		})
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
				logUtil.log({
					type: 'hardware',
					title: `Box's "${this.name}" starts detecting`
				})
				this.infrared.detectPresence()
					.then(this.onPresenceDetected.bind(this));
			});
	}
	startTheShow() {
		this.round++;
		logUtil.log({
			type: 'info',
			title: `Box "${this.name}" starts the show`,
			messages: [{ round: this.round }]
		});
		this.start.bind(this)();
	}
	restartTheShow() {
		this.round = 1;
		this.start.bind(this)();
	}
	onPresenceDetected() {
		logUtil.log({
			type: 'info',
			title: `Box "${this.name}" detected a presence`
		});
		this.motor.standUp()
			.then(() => {
				this.light.startBlinking();
				this.speaker.explainRules()
					.then(this.onRulesExplained.bind(this));
			})
	}
	onRulesExplained() {
		logUtil.log({
			type: 'info',
			title: `Box "${this.name}" explained the rules`
		});
		this.motor.lookUp()
			.then(() => {
				this.microphone.startRecording()
					.then(() => {
						logUtil.log({
							type: 'info',
							title: `Box "${this.name}" has successfully recorded a voice`
						});
						this.prepareToSpeak.bind(this)();
					})
					.catch(this.onRecordingFailed.bind(this));
			});
	}
	prepareToSpeak() {
		const isLastRound = this.isLastRound.bind(this)();
		if (isLastRound) {
			this.speakText.bind(this)();
		}
		else {
			this.forwardMessage.bind(this)('readyToSpeak');
		}
		logUtil.log({
			type: 'info',
			title: `Box "${this.name}" is prepared to speak`,
			messages: [{ round: this.round }]
		});
	}
	speakText() {
		this.light.stopBlinking();
		this.motor.lookStraight();
		this.speaker.speakText()
			.then(this.onTextSpoken.bind(this));
	}
	onRecordingFailed() {
		logUtil.log({
			type: 'warning',
			title: `Box "${this.name}" failed to record the voice`,
			messages: [{ then: 'Starts over again' }]
		});
		this.motor.lookStraight()
			.then(() => {
				this.speaker.sayNoRecordingError()
					.then(this.startTheShow.bind(this));
			});
	}
	onTextSpoken() {
		logUtil.log({
			type: 'info',
			title: `Box "${this.name}" repeated the text`
		});
		if (this.options.isMaster) {
			if (this.round === 1) {
				this.translator.translateText()
					.then(this.finish.bind(this))
			}
			else {
				logUtil.log({
					type: 'info',
					title: `Box "${this.name}"s show is over`,
					messages: [{ then: 'Starts over again' }]
				});
				this.round = 0;
				this.startTheShow.bind(this)();
			}
		}
		else {
			this.finish.bind(this)();
		}
	}
	finish() {
		logUtil.log({
			type: 'info',
			title: `Box "${this.name}" finished its round`,
			messages: [{ round: this.round }]
		});
		this.forwardMessage.bind(this)('done');
		this.motor.lieDown();
		logUtil.log({
			type: 'info',
			title: `Box "${this.name}"s show is over`
		});
	}
	onPreviousBoxSpeaking() {
		logUtil.log({
			type: 'info',
			title: `Box "${this.name}" is listening to its previous sibling`
		});
		this.motor.standUp()
			.then(() => {
				this.light.startBlinking();
				this.motor.lookUp()
					.then(() => {
						this.forwardMessage.bind(this)('readyToListen', 'prev')
					});
			});
	}
	isLastRound() {
		return this.options.isMaster && this.round > 1;
	}
}
