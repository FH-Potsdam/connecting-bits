import config from 'config';
import { Boards } from 'johnny-five';
import Box from './components/box';
import { createBoard } from './utils/boardsUtil';
import { createClient } from './utils/clientsUtil';
import logUtil from './utils/logUtil';

/**
 * @class Represents the whole chain of Boxes
 */
export default class BoardsChain {
	/**
	 * Initializes boards, mqqtt clients and starts the masterBox
	 * automatically. Is not meant to be imported.
	 */
	constructor() {
		const boardsConfigs = config.get('boards');
		const boards = new Boards(boardsConfigs.map((board) =>
			createBoard(board.name, board.id)));

		/**
		 * Collection of Boxes taking part to the show
		 * @type {Array}
		 */
		this.boxes = [];
		boards.each((board, index) => {
			let next;
			let prev;
			let isMaster = false;

			if (index === 0) {
				isMaster = true;
				prev = boardsConfigs[index + 1];
			} else {
				prev = boardsConfigs[index - 1];
			}

			if (index === boardsConfigs.length - 1) {
				next = boardsConfigs[0];
			} else {
				next = boardsConfigs[index + 1];
			}

			if (boardsConfigs.length === 1) {
				prev = next = board;
			}

			logUtil.log({
				type: 'info',
				title: `Box "${board.id}" initialized`,
				messages: [
					{ prev: prev.name },
					{ next: next.name },
					{ isMaster }
				]
			});
			const client = createClient(board.id);
			this.boxes.push(new Box(board, client, { next, isMaster, prev }));
		});

		/**
		 * The first box to start the show, the one recoring
		 * @type {Array}
		 */
		this.masterBox = this.boxes[0];
		boards.on('ready', this.onAllBoardsReady.bind(this));
	}
	/**
	 * Is called when all Johnny Five boards are ready.
	 * Starts the event chain by calling start the show
	 * on the master Box.
	 */
	onAllBoardsReady() {
		logUtil.log({
			type: 'hardware',
			title: `All boards ready`
		});
		this.masterBox.startTheShow();
	}
}

/**
 * Automatically starts the chain by creating a new instance
 * of the BoardChain class
 */
const chain = new BoardsChain();
