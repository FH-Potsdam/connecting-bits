/**
 * All hardcoded values and constants
 * for the infrared class
 * @type {Object}
 */
export const INFRARED_CONSTANTS = {
	UNUSED_PIN: 3,
	USED_PIN: 4,
	MIN_DETECTION_DISTANCE: 35,
	CONTROLLER_ID: '2Y0A02',
	MIN_PRESENCE_DURATION: 1200,
	EMPTY_RESOLVE_FUNCTION: () => {}
};

/**
 * All hardcoded values and constants
 * for the light class
 * @type {Object}
 */
export const LIGHT_CONSTANTS = {
	PIN: 'D7',
	BLINK_SPEED: 500
};

/**
 * All hardcoded values and constants
 * for the motor class
 * @type {Object}
 */
export const MOTOR_CONSTANTS = {
	LIFT_PIN: 1,
	TILT_PIN: 2,
	LIFT_TYPE: 'standard',
	TILT_TYPE: 'standard',
	SPEED: 200,
	LYING: 30,
	STANDING: 105,
	TILTED: 120,
	STRAIGHT: 30
};
