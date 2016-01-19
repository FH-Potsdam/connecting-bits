import config from 'config';
import Particle from 'particle-io';

const token = config.get(`token`)

module.exports = {
	createBoard: (id, deviceId) => {
		return { id, io: new Particle({ token, deviceId }) };
	},
	getBoardInBoardsByName: (boardsArray, name) => {
		let relevantBoard;
		boardsArray.each((board) => {
			if (board.id === name) {
				relevantBoard = board;
			}
		});
		return relevantBoard;
	}
};
