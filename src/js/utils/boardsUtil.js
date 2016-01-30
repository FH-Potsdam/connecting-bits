import config from 'config';
import Particle from 'particle-io';

const token = config.get(`token`);

/**
 * @class Utility for handling Johnny Five boards
 */
export default class BoardsUtil {
	/**
	 * Returns a config for a Johnny Five board with an id and a Particle
	 * Photon board
	 * @param  {String} id - Any name you want to assign to your Photon board
	 * @param  {String} deviceId - The Particle.io deviceId of you photon
	 * @return {Object}
	 * @example
	 * const board = createBoard('myFavoriteBoard', '12345');
	 */
	static createBoard(id, deviceId) {
		return { id, io: new Particle({ token, deviceId, deviceName: id }) };
	}
}
