import { Servo } from 'johnny-five';
import logUtil from '../../utils/logUtil';
import { MOTOR_CONSTANTS } from '../../constants';
const {
	LIFT_PIN,
	LIFT_TYPE,
	TILT_PIN,
	TILT_TYPE,
	SPEED,
	LYING,
	STANDING,
	TILTED,
	STRAIGHT
} = MOTOR_CONSTANTS;

/**
 * @class Manages the servor motors
 */
export default class Motor {
	/**
	 * Constructor for the Motor class. Needs a j5 board instance
	 * to work well. !CAUTION¡ The j5 board must already be ready.
	 * @param  {Johnny Five board instance} board
	 * @private
	 */
	constructor(board) {
		/**
		 * The servo meant to lift the box up and down
		 * @type {Servo}
		 */
		this.liftServo = new Servo({
			pin: LIFT_PIN,
			startAt: LYING,
			type: LIFT_TYPE,
			board
		});
		/**
		 * The servo meant to make the box look up and straight
		 * @type {Servo}
		 */
		this.tiltServo = new Servo({
			pin: TILT_PIN,
			startAt: STRAIGHT,
			type: TILT_TYPE,
			board
		});

		/**
		 * Is the Box standing up?
		 * @type {Boolean}
		 */
		this.stands = false;
		/**
		 * Is the Box looking up?
		 * @type {Boolean}
		 */
		this.titls = false;

		this.checkAndMove = this.checkAndMove;
		this.lieDown = this.lieDown.bind(this);
		this.standUp = this.standUp.bind(this);
		this.lookUp = this.lookUp.bind(this);
		this.lookStraight = this.lookStraight.bind(this);
	}
	/**
	 * Lifts the Box down
	 * @return {Promise}
	 * @public
	 */
	lieDown() {
		return new Promise((resolve, reject) => {
			if (this.liftServo.position === LYING) {
				resolve();
				return;
			}
			this.liftServo
				.removeAllListeners('move:complete')
				.on('move:complete', () => {
					this.stands = false;
					resolve();
				});
			this.liftServo.to(LYING, SPEED);
			logUtil.log({
				type: 'hardware',
				title: 'Servo lieDown',
				messages: [
					{ stands: this.stands },
					{ tilts: this.titls },
					{ position: this.liftServo.position }
				]
			});
		});
	}
	/**
	 * Lifts the Box up
	 * @return {Promise}
	 * @public
	 */
	standUp() {
		return new Promise((resolve, reject) => {
			if (this.liftServo.position === STANDING) {
				resolve();
				return;
			}
			this.liftServo
				.removeAllListeners('move:complete')
				.on('move:complete', () => {
					this.stands = true;
					resolve();
				});
			this.liftServo.to(STANDING, SPEED);
			logUtil.log({
				type: 'hardware',
				title: 'Servo standUp',
				messages: [
					{ stands: this.stands },
					{ tilts: this.titls },
					{ position: this.liftServo.position }
				]
			});
		});
	}
	/**
	 * Makes the Box look up
	 * @return {Promise}
	 * @public
	 */
	lookUp() {
		return new Promise((resolve, reject) => {
			if (this.tiltServo.position === TILTED) {
				resolve();
				return;
			}
			this.tiltServo
				.removeAllListeners('move:complete')
				.on('move:complete', () => {
					this.titls = true;
					resolve();
				});
			this.tiltServo.to(TILTED, SPEED);
			logUtil.log({
				type: 'hardware',
				title: 'Servo lookUp',
				messages: [
					{ stands: this.stands },
					{ tilts: this.titls },
					{ position: this.tiltServo.position }
				]
			});
		});
	}
	/**
	 * Makes the Box look down
	 * @return {Promise}
	 * @public
	 */
	lookStraight() {
		return new Promise((resolve, reject) => {
			if (this.tiltServo.position === STRAIGHT) {
				resolve();
				return;
			}
			this.tiltServo
				.removeAllListeners('move:complete')
				.on('move:complete', () => {
					this.titls = false;
					resolve();
				});
			this.tiltServo.to(STRAIGHT, SPEED);
			logUtil.log({
				type: 'hardware',
				title: 'Servo lookStraight',
				messages: [
					{ stands: this.stands },
					{ tilts: this.titls },
					{ position: this.tiltServo.position }
				]
			});
		});
	}
}
