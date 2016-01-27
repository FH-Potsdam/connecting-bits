import { Led } from  'johnny-five';

export default class Light {
	constructor(board) {
		this.led = new Led({ pin: 'D7', board });
	}
	startBlinking() {
		return new Promise((resolve) => {
			this.led.blink();
			resolve()
		});
	}
	stopBlinking() {
		return new Promise((resolve) => {
			this.led.stop.off();
			resolve()
		});
	}
}