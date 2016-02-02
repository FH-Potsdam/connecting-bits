import { Servo } from 'johnny-five';
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
	}
	/**
	 * Generic function that checks if a servo is already in the
	 * whished position and rotates it if not.
	 * @param  {Boolean} actualPositionState - The actual state to check
	 * @param  {Boolean} whishedPositionState - The whished state
	 * @param  {Number} positionToMoveTo - The rotation the servo need to accomplish
	 * @param  {Johnny Five Servo instance} servo
	 * @return {Promise}
	 * @private
	 */
	checkAndMove(
		actualPositionState,
		whishedPositionState,
		positionToMoveTo,
		servo) {
		return new Promise((resolve) => {
			if (actualPositionState === whishedPositionState) {
				resolve();
				return;
			}
			servo
				.removeAllListeners('move:complete')
				.on('move:complete', () => {
					servo.removeAllListeners('move:complete');
					resolve();
				});
			servo.to(positionToMoveTo, SPEED);
		});
	}
	/**
	 * Lifts the Box down
	 * @return {Promise}
	 * @public
	 */
	lieDown() {
		return this.checkAndMove(
			this.stands,
			false,
			LYING,
			this.liftServo
		);
	}
	/**
	 * Lifts the Box up
	 * @return {Promise}
	 * @public
	 */
	standUp() {
		return this.checkAndMove(
			this.stands,
			true,
			STANDING,
			this.liftServo
		);
	}
	/**
	 * Makes the Box look up
	 * @return {Promise}
	 * @public
	 */
	lookUp() {
		return this.checkAndMove(
			this.titls,
			true,
			TILTED,
			this.tiltServo
		);
	}
	/**
	 * Makes the Box look down
	 * @return {Promise}
	 * @public
	 */
	lookStraight() {
		return this.checkAndMove(
			this.tilts,
			false,
			STRAIGHT,
			this.tiltServo
		);
	}
}
