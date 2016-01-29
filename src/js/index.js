import config from 'config';
import { Boards } from 'johnny-five';
import Box from './components/box';
import { createBoard, getBoardInBoardsByName } from './utils/boardsUtil';
import { createClient, getClientInClientsByName } from './utils/clientsUtil';
import logUtil from './utils/logUtil';

/**
 * @class Most global class
 * @param none
 */
export default class BoardsChain {
	constructor() {
		const boardsConfigs = config.get('boards');
		const boards = new Boards(boardsConfigs.map((board) =>
			createBoard(board.name, board.id)));

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

		this.masterBox = this.boxes[0];
		boards.on('ready', this.onAllBoardsReady.bind(this));
	}
	onAllBoardsReady() {
		logUtil.log({
			type: 'hardware',
			title: `All boards ready`
		});
		this.masterBox.startTheShow();
	}
}

const chain = new BoardsChain();
