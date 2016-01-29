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

export default class Intrared {
	constructor(board) {
		this.board = board;
		this.proximity = this.getInitializedProximity.bind(this)();
		this.distance = 0;
		this.presenceDetected = false;
		this.resolve = EMPTY_RESOLVE_FUNCTION;
		this.debouncedCheck = _.throttle(
			this.checkLaterIfStillPresent.bind(this),
			MIN_PRESENCE_DURATION
		);

		this.proximity.on('data', (data) => {
			this.onData.bind(this)(data.cm);
		});
	}
	onData(cm) {
		if (cm < MIN_DETECTION_DISTANCE) {
			this.presenceDetected = true;
			logUtil.log({
				type: 'hardware',
				title: 'Presence',
				messages: [ { distance: `${cm} cm` } ]
			});
			this.debouncedCheck();
		} else {
			this.presenceDetected = false;
		}
	}
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
	detectPresence() {
		return new Promise((resolve) => {
			this.resolve = resolve;
		});
	}
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
