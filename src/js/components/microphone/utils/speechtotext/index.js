const request = require('request');
import fs from 'fs';

/**
 * @class A utility to tronsform audio files into text
 */
export default class SpeechToText {
	/**
	 * The class's constructor. Is called whe initialized with the new keyword.
	 * @param  {String} language - Language of the audio file to be converted
	 */
	constructor(language) {
		/**
		 * The language of the original speech (audio file)
		 * @type {String} - Alpha2 code
		 */
		this.language = language;
	}
	/**
	 * Returns the access token of the Api used to convert the speech into text
	 * @param  {String}   clientId     - The Api's client id
	 * @param  {String}   clientSecret - The Api's client secret token
	 * @param  {Function} callback     - The function to be executed afterwards
	 */
	getAccessToken(clientId, clientSecret, callback) {
		request.post({
			url: 'https://oxford-speech.cloudapp.net/token/issueToken',
			form: {
				grant_type: 'client_credentials',
				client_id: encodeURIComponent(clientId),
				client_secret: encodeURIComponent(clientSecret),
				scope: 'https://speech.platform.bing.com'
			}
		}, function(err, resp, body) {
			if (err) {
				return callback(err);
			}
			try {
				var accessToken = JSON.parse(body).access_token;
				if (accessToken) {
					callback(null, accessToken);
				} else {
					callback(body);
				}
			} catch (e) {
				callback(e);
			}
		});
	}
	/**
	 * Converts the speech into text
	 * @param  {String}   filename    - The file to take the text from
	 * @param  {String}   accessToken - The access token for the API
	 * @param  {String}   language    - The language of the audio file
	 * @param  {Function} callback    - The function to be called when done
	 */
	convert(filename, accessToken, language, callback) {
		fs.readFile(filename, function(err, waveData) {
			if (err) {
				return callback(err);
			}
			request.post({
				url: 'https://speech.platform.bing.com/recognize/query',
				qs: {
					scenarios: 'ulm',
					appid: 'D4D52672-91D7-4C74-8AD8-42B1D98141A5', // This magic value is required
					locale: `${language}-${language}`,
					'device.os': 'wp7',
					version: '3.0',
					format: 'json',
					requestid: '1d4b6030-9099-11e0-91e4-0800200c9a66', // can be anything
					instanceid: '1d4b6030-9099-11e0-91e4-0800200c9a66' // can be anything
				},
				body: waveData,
				headers: {
					Authorization: 'Bearer ' + accessToken,
					'Content-Type': 'audio/wav; samplerate=16000',
					'Content-Length': waveData.length
				}
			}, function(postError, resp, body) {
				if (postError) {
					return callback(postError);
				}
				try {
					callback(null, JSON.parse(body));
				} catch (e) {
					callback(e);
				}
			});
		});
	}
}
