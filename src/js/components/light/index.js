import { Led } from 'johnny-five';
import { LIGHT_CONSTANTS } from '../../constants';
const { BLINK_SPEED, PIN } = LIGHT_CONSTANTS;

/**
 * @class Manages the led lights
 */
export default class Light {
	/**
	 * Constructor for the Light class. Needs a j5 board instance
	 * to work well. !CAUTION¡ The j5 board must already be ready.
	 * @param  {Johnny Five board instance} board
	 * @private
	 */
	constructor(board) {
		/**
		 * The led light of the class (for now just one)
		 * @type {Led}
		 */
		this.led = new Led({ pin: PIN, board });
	}
	/**
	 * Is called to make the lights blink
	 * @return {Promise}
	 * @public
	 */
	startBlinking() {
		return new Promise((resolve) => {
			this.led.blink(BLINK_SPEED);
			resolve();
		});
	}
	/**
	 * Is called to make the lights stop blinking
	 * @return {Promise}
	 * @public
	 */
	stopBlinking() {
		return new Promise((resolve) => {
			this.led.stop().off();
			resolve();
		});
	}
}
