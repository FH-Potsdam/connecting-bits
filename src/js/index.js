import config from 'config';
import { Boards } from 'johnny-five';
import Box from './components/box';
import { createBoard, getBoardInBoardsByName } from './utils/boardsUtil';
import { createClient, getClientInClientsByName } from './utils/clientsUtil';

const boardsConfigs = config.get('boards');
const boards = new Boards(boardsConfigs.map((board) =>
	createBoard(board.name, board.id)));

const boxes = [];
boards.each((board, index) => {
	let next;
	let prev;

	if (index === 0) { prev = false; }
	else { boardsConfigs[index === 0 ? boardsConfigs.length - 1 : index - 1].name; }

	if (index === boardsConfigs.length - 1) { next = false; }
	else { next = boardsConfigs[index + 1].name; }

	const client = createClient(board.id);
	boxes.push(new Box(board, client, { prev, next }));
});

var box1Client = boxes[0].getClient();

boards.on('ready', () => {
	box1Client.publish('inputs/vogeliton', 'START INPUT');
	console.log('START MESSAGE SENT');
});
