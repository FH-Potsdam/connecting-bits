import config from 'config';
import { connect } from 'mqtt';
const { usr, psw } = config.get('shiftr');
const url = `mqtt://${usr}:${psw}@broker.shiftr.io`;

/**
 * @class Utility for creating Mqtt clients
 */
export default class ClientsUtil {
	/**
	 * Creates and returns a mqtt client with the give name
	 * @param  {String} name - The same name as your Johnny Five board instance
	 * @return {Mqtt client} An Mqqt client connected via shiftr.io
	 */
	static createClient(name) {
		const client = connect(url, { clientId: name });
		client.name = name;
		return client;
	}
}
