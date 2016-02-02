import { Led } from 'johnny-five';
import config from 'config';
import Microphone from '../microphone';
import Translator from '../translator';
import Light from '../light';
import Motor from '../motor';
import Speaker from '../speaker';
import Infrared from '../infrared';
import logUtil from '../../utils/logUtil';

/**
 * @class Box is the class that contains the methods for all actions a Box
 * should be able to perform. It takes care of orchestring the chain of
 * events.
 */
export default class Box {
	/**
	 * Constructor for the Light class
	 * @param {JohnnyFive board instanxe} board - this is the board class delivered
	 * by johnny five for one board. In this case we talk about a photon board
	 * @param {Mqtt client} client - This is an  instance of an mqtt client that
	 * will be used to communicate with oder boxes
	 * @param {Object} options - Option containing next, prev and isMaster
	 */
	constructor(board, client, options) {
		/**
		 * A Johnny Five Board instance
		 * @type {Board}
		 */
		this.board = board;
		/**
		 * An Mqtt client
		 * @type {Mqtt client}
		 */
		this.client = client;
		/**
		 * Option with next, prev and isMaster
		 * @type {Object}
		 */
		this.options = options;
		/**
		 * The Box's name
		 * @type {String}
		 */
		this.name = this.board.id;
		/**
		 * The round actually playing
		 * @type {Number}
		 */
		this.round = 0;

		// initialise subcomponents
		/**
		 * The Translator component
		 * Will be intialized when all boards are ready
		 * @type {[type]}
		 */
		this.translator = null;
		/**
		 * The Light component
		 * Will be intialized when all boards are ready
		 * @type {Light}
		 */
		this.light = null;
		/**
		 * The Motor component
		 * Will be intialized when all boards are ready
		 * @type {Motor}
		 */
		this.motor = null;
		/**
		 * The Speak component
		 * Will be intialized when all boards are ready
		 * @type {Speak}
		 */
		this.speaker = null;
		/**
		 * The Infra component
		 * Will be intialized when all boards are ready
		 * @type {Infra}
		 */
		this.infrared = null;
		/**
		 * The Micro component
		 * Will be intialized when all boards are ready
		 * @type {Micro}
		 */
		this.microphone = null;

		client.on('connect', this.onConnect.bind(this));
		client.on('message', this.onMessage.bind(this));
	}
	/** Is called when the Box's mqtt client is ready and connected. */
	onConnect() {
		logUtil.log({
			type: 'shiftr',
			title: `Box "${ this.name }" connected and subscribed`,
			messages: [ { 'subscription topic': `/inputs/${ this.name }` } ]
		});
		this.client.subscribe(`/inputs/${ this.name }`);
		this.board.on('ready', this.onBoardReady.bind(this));
	}
	/**
	 * Is called when a mqtt message is received
	 * @param  {string} topic - the mqtt topic the message was sent on
	 * @param  {string} message - the message sent via mqtt
	 */
	onMessage(topic, message) {
		clearTimeout(this.interval);
		logUtil.log({
			type: 'shiftr',
			title: `Box "${ this.name }" received a message`,
			messages: [
				{ topic },
				{ message: message.toString() }
			]
		});

		switch (message.toString()) {
			case 'done':
				this.round++;
				this.prepareToSpeak.bind(this)();
				break;
			case 'readyToListen':
				this.speakText.bind(this)();
				break;
			case 'readyToSpeak':
				this.onPreviousBoxSpeaking.bind(this)();
				break;
			default: return;
		}
	}
	/**
	 * Send a message to wether the nex or the previous Box via mqtt
	 * @param  {string} message - message to be sent to the sibling Box
	 * @param  {string} recipient - wether "next" or "prev"
	 */
	sendMessage(message, recipient = 'next') {
		const recipientBox = this.options[ recipient ];
		if (!recipientBox) {
			logUtil.log({
				type: 'warning',
				title: `Box "${ this.name }" has an invalid next sibling`,
				messages: [
					{ sibling: recipientBox.name }
				]
			});
		}

		const topic = `/inputs/${ recipientBox.name }`;
		logUtil.log({
			type: 'shiftr',
			title: `Box "${ this.name }" forwarded a message`,
			messages: [
				{ from: this.name },
				{ to: recipientBox.name },
				{ topic },
				{ message }
			]
		});
		this.client.publish(topic, message);
	}
	/** Is called when the Photon board is ready */
	onBoardReady() {
		this.translator = new Translator(this.name, this.options.language);
		this.speaker = new Speaker(this.name, this.options.language);
		this.microphone = new Microphone(this.name, this.options.language);
		this.motor = new Motor(this.board);
		this.light = new Light(this.board);
		this.infrared = new Infrared(this.board);
		logUtil.log({
			type: 'hardware',
			title: `Box's board of "${ this.name }" is ready`
		});
	}
	/**
	 * Retruns the Box's mqtt client
	 * @return {Mqtt client instance}
	 */
	getClient() {
		return this.client;
	}
	/**
	 * Returns the Box's j5 board
	 * @return {Johnny Five board instance}
	 */
	getBoard() {
		return this.board;
	}
	/** Internal start, starts detecting */
	start() {
		this.motor.lieDown()
			.then(() => {
				logUtil.log({
					type: 'hardware',
					title: `Box's "${ this.name }" starts detecting`
				});
				this.infrared.detectPresence()
					.then(this.onPresenceDetected.bind(this));
			});
	}
	/** External start, intreases the round */
	startTheShow() {
		this.round++;
		logUtil.log({
			type: 'info',
			title: `Box "${ this.name }" starts the show`,
			messages: [ { round: this.round } ]
		});
		this.start.bind(this)();
	}
	/** Restarts the complete show and resets the round */
	restartTheShow() {
		this.round = 1;
		this.start.bind(this)();
	}
	/** Is called when the infrared detects a presence */
	onPresenceDetected() {
		logUtil.log({
			type: 'info',
			title: `Box "${ this.name }" detected a presence`
		});
		this.motor.standUp()
			.then(() => {
				this.speaker.explainRules()
					.then(this.onRulesExplained.bind(this))
					.catch(() => {
						logUtil.log({
							type: 'error',
							title: `Rules not explained`
						});
					});
			});
	}
	/** Is called when the Box has spoken the rules out loud */
	onRulesExplained() {
		logUtil.log({
			type: 'info',
			title: `Box "${ this.name }" explained the rules`
		});
		this.motor.lookUp()
			.then(() => {
				this.light.startBlinking();
				this.microphone.startRecording()
					.then(() => {
						logUtil.log({
							type: 'info',
							title: `Box "${ this.name }" has successfully recorded a voice`
						});
						this.prepareToSpeak.bind(this)();
					})
					.catch(this.onRecordingFailed.bind(this));
			});
	}
	/** Is called when the Box is meant to speak */
	prepareToSpeak() {
		this.light.stopBlinking();
		const isLastRound = this.isLastRound.bind(this)();
		if (isLastRound) {
			this.speakText.bind(this)();
		} else {
			this.sendMessage.bind(this)('readyToSpeak');
		}
		logUtil.log({
			type: 'info',
			title: `Box "${ this.name }" is prepared to speak`,
			messages: [ { round: this.round } ]
		});
	}
	/** Speaks the text out loud */
	speakText() {
		this.motor.lookStraight();
		this.speaker.speakText()
			.then(this.onTextSpoken.bind(this));
	}
	/**
	 * Is called when the voice was badly recorded, when no sound was identified
	 * or when the speech could not be transformed into text
	 */
	onRecordingFailed() {
		logUtil.log({
			type: 'warning',
			title: `Box "${ this.name }" failed to record the voice`,
			messages: [ { then: 'Starts over again' } ]
		});
		this.motor.lookStraight()
			.then(() => {
				this.speaker.sayNoRecordingError()
					.then(this.startTheShow.bind(this));
			});
	}
	/** Is called whe the box has successfully spoken the text out loud */
	onTextSpoken() {
		logUtil.log({
			type: 'info',
			title: `Box "${ this.name }" repeated the text`
		});
		if (this.options.isMaster) {
			if (this.round === 1) {
				logUtil.log({
					type: 'info',
					title: `Box "${ this.name }"s is now translating`,
					messages: [
						{ next: this.options.next.name },
						{ 'from language': this.options.language },
						{ 'to language': this.options.next.language }
					]
				});
			} else {
				logUtil.log({
					type: 'info',
					title: `Box "${ this.name }"s show is over`,
					messages: [ { then: 'Starts over again' } ]
				});
				this.round = 0;
				this.startTheShow.bind(this)();
			}
		}
		this.translator.translateNext(this.options.next)
				.then(this.finish.bind(this));
	}
	/** Ends the show of the box */
	finish() {
		logUtil.log({
			type: 'info',
			title: `Box "${ this.name }" finished its round`,
			messages: [ { round: this.round } ]
		});
		this.sendMessage.bind(this)('done');
		this.motor.lieDown();
		logUtil.log({
			type: 'info',
			title: `Box "${ this.name }"s show is over`
		});
	}
	/** Is called when the previous box is speaking the text out loud */
	onPreviousBoxSpeaking() {
		logUtil.log({
			type: 'info',
			title: `Box "${ this.name }" is listening to its previous sibling`
		});
		this.motor.standUp()
			.then(() => {
				this.light.startBlinking();
				this.motor.lookUp()
					.then(() => {
						this.sendMessage.bind(this)('readyToListen', 'prev');
					});
			});
	}
	/** Is called to check is this is the last round */
	isLastRound() {
		return this.options.isMaster && this.round > 1;
	}
}
