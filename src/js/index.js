import config from 'config';
import { Boards } from 'johnny-five';
import Box from './components/box';
import { createBoard, getBoardInBoardsByName } from './utils/boardsUtil';
import { createClient, getClientInClientsByName } from './utils/clientsUtil';
import logUtil from './utils/logUtil';

const boardsConfigs = config.get('boards');
const boards = new Boards(boardsConfigs.map((board) =>
	createBoard(board.name, board.id)));

const boxes = [];
boards.each((board, index) => {
	let next;
	let isMaster = false;

	if (index === 0) { isMaster = true; }

	if (index === boardsConfigs.length - 1) {
		next = boardsConfigs[0];
	}
	else {
		next = boardsConfigs[index + 1].name;
	}

	logUtil.log({
		type: 'info',
		title: `Box "${board.id}" initialized`,
		messages: [
			{ next: next.name },
			{ isMaster }
		]
	})
	const client = createClient(board.id);
	boxes.push(new Box(board, client, { next, isMaster }));
});

boards.on('ready', () => {
	logUtil.log({
		type: 'hardware',
		title: `All boards ready`
	})
	boxes[0].getReady();
});
