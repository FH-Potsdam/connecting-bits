import { Led } from 'johnny-five';
import { LIGHT_CONSTANTS } from '../../constants';
const { BLINK_SPEED, PIN } = LIGHT_CONSTANTS;

export default class Light {
	constructor(board) {
		this.led = new Led({ pin: PIN, board });
	}
	startBlinking() {
		return new Promise((resolve) => {
			this.led.blink(BLINK_SPEED);
			resolve();
		});
	}
	stopBlinking() {
		return new Promise((resolve) => {
			this.led.stop.off();
			resolve();
		});
	}
}
