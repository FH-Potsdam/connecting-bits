import { Servo } from 'johnny-five';
import MOTOR_CONSTANTS from '../../constants';
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

export default class Motor {
	constructor(board) {
		this.liftServo = new Servo({
			pin: LIFT_PIN,
			startAt: LYING,
			type: LIFT_TYPE,
			board
		});
		this.tiltServo = new Servo({
			pin: TILT_PIN,
			startAt: STRAIGHT,
			type: TILT_TYPE,
			board
		});

		this.stands = false;
		this.titls = false;
	}
	checkAndMove(tocheck, checkValue, position) {
		return new Promise((resolve) => {
			if (tocheck === checkValue) {
				resolve();
				return;
			}
			this.liftServo('move:complete', resolve);
			this.liftServo.to(position, SPEED);
			this.liftServo('move:complete', false);
		});
	}
	lieDown() {
		return this.checkAndMove(this.stands, false, LYING);
	}
	standUp() {
		return this.checkAndMove(this.stands, true, STANDING);
	}
	lookUp() {
		return this.checkAndMove(this.titls, true, TILTED);
	}
	lookStraight() {
		return this.checkAndMove(this.thils, false, STRAIGHT);
	}
}