import { Servo } from 'johnny-five';

const SPEED = 200;
const LYING = 0;
const STANING = 0;
const TILTED = 0;
const STRAIGHT = 0;

export default class Motor {
	constructor(board) {
		this.liftServo = new Servo({ pin: 'D2', board });
		this.tiltServo = new Servo({ pin: 'D3', board });

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