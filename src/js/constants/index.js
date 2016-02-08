/**
 * All hardcoded values and constants
 * for the infrared class
 * @type {Object}
 */
export const INFRARED_CONSTANTS = {
	UNUSED_PIN: 'A3',
	USED_PIN: 'A4',
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
	PIN: 'D0',
	BLINK_SPEED: 500
};

/**
 * All hardcoded values and constants
 * for the motor class
 * @type {Object}
 */
export const MOTOR_CONSTANTS = {
	LIFT_PIN: 'D3',
	TILT_PIN: 'D2',
	LIFT_TYPE: 'standard',
	TILT_TYPE: 'standard',
	SPEED: 300,
	LYING: 30,
	STANDING: 105,
	TILTED: 120,
	STRAIGHT: 30
};

export const GENERAL_CONSTANTS = {
	PAUSE_TIME_BETWEEN_INTERACTIONS: 1000
};
