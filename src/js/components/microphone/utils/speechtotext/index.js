const request = require('request');
import fs from 'fs';


export default class SpeechToText {
	constructor(language) {
		this.language = language;
		this.getAccessToken = this.getAccessToken.bind(this);
		this.convert = this.convert.bind(this);
	}
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
