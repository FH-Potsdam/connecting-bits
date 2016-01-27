
export default class Motor {
	constructor(board) {
		this.board = board;
	}
	lieDown() {
		return new Promise((resolve) => resolve());
	}
	standUp() {
		return new Promise((resolve) => resolve());
	}
	lookUp() {
		return new Promise((resolve) => resolve());
	}
	lookStraight() {
		return new Promise((resolve) => resolve());
	}
}