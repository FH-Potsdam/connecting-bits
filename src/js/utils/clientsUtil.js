import config from 'config';
import { connect } from 'mqtt';
const { usr, psw } = config.get('shiftr');
const url = `mqtt://${usr}:${psw}@broker.shiftr.io`;

module.exports = {
	createClient: (name) => {
		const client = connect(url, { clientId: name });
		client.name = name;
		return client;
	},
	getClientInClientsByName: (clientsArray, name) =>
		clientsArray.filter((client) =>
			client.name === name)[0]
};
