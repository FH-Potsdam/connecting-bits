import _ from 'lodash';
import { Proximity } from 'johnny-five';
import logUtil from '../../utils/logUtil';
import { INFRARED_CONSTANTS } from '../../constants';
const {
	UNUSED_PIN,
	USED_PIN,
	MIN_DETECTION_DISTANCE,
	CONTROLLER_ID,
	MIN_PRESENCE_DURATION,
	EMPTY_RESOLVE_FUNCTION
} = INFRARED_CONSTANTS;

/**
 * @class Manages the infrared sensor
 */
export default class Intrared {
	/**
	 * Constructor for the Infrared class. Needs a j5 board instance
	 * to work well. !CAUTION¡ The j5 board must already be ready.
	 * @param  {Johnny Five board instance} board
	 * @private
	 */
	constructor(board) {
		/**
		 * Johnny Five Board instance
		 * @type {Board}
		 */
		this.board = board;
		/**
		 * Johnny Five Proximity instance
		 * @type {[type]}
		 */
		this.proximity = this.getInitializedProximity.bind(this)();
		/**
		 * Actual detected distance in cm
		 * @type {Number}
		 */
		this.distance = 0;
		/**
		 * Wether or not a human presence is detected
		 * @type {Boolean}
		 */
		this.presenceDetected = false;
		/**
		 * The Function to resolve in case a long presence
		 * has been detected
		 * @type {Function}
		 */
		this.resolve = EMPTY_RESOLVE_FUNCTION;
		/**
		 * A throttled function checking if a human presence
		 * is still detected after a certain time
		 * @type {Throttled Function}
		 */
		this.throttledCheck = _.throttle(
			this.checkLaterIfStillPresent.bind(this),
			MIN_PRESENCE_DURATION
		);

		this.proximity.on('data', (data) => {
			this.onData.bind(this)(data.cm);
		});
	}
	/**
	 * Is called when the infrared detects a distance. In other words,
	 * all the time.
	 * @param  {Number} cm
	 * @private
	 */
	onData(cm) {
		if (cm < MIN_DETECTION_DISTANCE) {
			this.presenceDetected = true;
			logUtil.log({
				type: 'hardware',
				title: 'Presence',
				messages: [ { distance: `${cm} cm` } ]
			});
			this.throttledCheck();
		} else {
			this.presenceDetected = false;
		}
	}
	/**
	 * @return {Johnny Five Proximity class} Return a valid Johnny Five
	 * instance of the Proximity class. See http://johnny-five.io/api/proximity/
	 * for mor details.
	 * @private
	 */
	getInitializedProximity() {
		const unused = new Proximity({
			controller: CONTROLLER_ID,
			pin: UNUSED_PIN,
			board: this.board
		});
		const proximity = new Proximity({
			controller: CONTROLLER_ID,
			pin: USED_PIN,
			board: this.board
		});
		return proximity;
	}
	/**
	 * Is called to start the infrared detection. Overrides the global
	 * resolve function with the Promise.resolve function.
	 * @return {Promise}
	 * @public
	 */
	detectPresence() {
		return new Promise((resolve) => {
			this.resolve = resolve;
		});
	}
	/**
	 * Checks if a presence is detected and resovles the Promise
	 * if so. Resets the promise to its default.
	 * @private
	 */
	checkLaterIfStillPresent() {
		if (this.presenceDetected) {
			logUtil.log({
				type: 'hardware',
				title: 'Long presence detected'
			});
			this.resolve();
			this.resolve = EMPTY_RESOLVE_FUNCTION;
		}
	}
}
