// thanks to: https://gist.github.com/lukehoban/0ee5c1bef438dc5bd7cb
const fetch = require('node-fetch');
const fs = require('fs');
const util = require('util');
const request = require('request');
const rec = require('node-record-lpcm16');
const terminal = require('oh-my-terminal');

const clientId = 'test-app'; // Can be anything
const clientSecret = ''; // API key from Azure marketplace

const api_key = ''; // Google API Key

let dirData = 'data/'; // set directory where thing will be saved and read
let locAudio = 'audio.wav'; // set where the audio file will be
let locTxt = 'text.txt'; // set where the test will be saved

//document.querySelector(".setup").addEventListener("click", master); // simulate incoming signal
document.querySelector(".record").addEventListener("click", record);
document.querySelector(".translate").addEventListener("click", audioToText);

class toJSON  {
  constructor(recDir, recFile, recID) {
    let date = new Date();

    // writing json file
      let recordStorage = {
        records: [{
          filename: recFile + '_' + recID + '.wav',
          id: recID,
          timestamp: date
        }]
      };

      if (!fs.existsSync('./data/records.json')) {
        fs.writeFileSync('./data/records.json', JSON.stringify(recordStorage));
      } else {
        // Get content from file
        let contents = fs.readFileSync("./data/records.json");
        // Define to JSON type
        let jsonContent = JSON.parse(contents);

        // pushing new record to json
        jsonContent['records'].push(
          {
            "filename": recFile + '_' + recID + '.wav',
            "id": recID,
            "timestamp": date
          }
        );
        // Write file
        fs.writeFileSync('./data/records.json', JSON.stringify(jsonContent));
      }

      console.log('### JSON written');
  }
}

class Rec {
  constructor(recDir, recFile, recID, recTime, callback) {
    let file = fs.createWriteStream(recDir + recFile + '_' + recID + '.wav', { encoding: 'binary' });

    rec.start({
      sampleRate: 44100,
      verbose: true
    })
    .pipe(file);

    setTimeout(function () {
      rec.stop();
      callback();
    }, recTime); // stop after 10 seconds

  }
}

// record audio file
function record(sensorRdy) {
  let dir           = 'data/',
      file          = 'newAudio',
      recordingID   = '123456',
      recordingTime = '5000';
  let recordIt = new Rec(dir, file, recordingID, recordingTime, function() {
    console.log('### Soundfile written');
    let json = new toJSON(dir, file, recordingID);
  });
}


record();






// OUTPUT
function output( data, input, callback ) {
  console.log('You said: ', input);
  console.log(data);
  console.log('translated:', data.data.translations[0].translatedText);

  callback(data.data.translations[0].translatedText);
}

// send input to google to translate
// Loop
// say: "Eingang japanisch" => store "ja" to variable -> google
function sendData(input, callback) {
	return fetch(`https://www.googleapis.com/language/translate/v2?key=${api_key}=${input}&source=de&target=en`) // API Link
		.then(res => res.json()) // fetch result to json
		.then(json => output(json, input, callback)); // send json to another function
}


// converts written audio file to string
function audioToText() {
  getAccessToken(clientId, clientSecret, function(err, accessToken) {
    if(err) return console.log(err);
    console.log('Got access token: ' + accessToken);

      speechToText(dirData + locAudio, accessToken, function(err, res) {
        if(err) return console.log(err);

        var resConfidence = res.results[0].confidence; // result of confidence
        var resLexical = res.results[0].lexical; // result of written text from audio
        console.log('Confidence ' + resConfidence + ' for: "' + resLexical + '"');
        fs.writeFile(dirData + locTxt, resLexical, function(err) {
        	if(err) return console.log(err);

        	console.log('Written text into file');
          console.log('--------------------------------');
          console.log('google output: ');

          sendData(resLexical, function(translation) {
            let output = 'say -v "Ting-Ting" ' + translation; // change var to trans text
            console.log(output);
            terminal.exec(output);
          });

        });
      });
  });
}

  // ==== Helpers ====

  function getAccessToken(clientId, clientSecret, callback) {
    request.post({
      url: 'https://oxford-speech.cloudapp.net/token/issueToken',
      form: {
        'grant_type': 'client_credentials',
        'client_id': encodeURIComponent(clientId),
        'client_secret': encodeURIComponent(clientSecret),
        'scope': 'https://speech.platform.bing.com'
      }
    }, function(err, resp, body) {
      if(err) return callback(err);
      try {
        var accessToken = JSON.parse(body).access_token;
        if(accessToken) {
          callback(null, accessToken);
        } else {
          callback(body);
        }
      } catch(e) {
        callback(e);
      }
    });
  }

  function speechToText(filename, accessToken, callback) {
    fs.readFile(filename, function(err, waveData) {
      if(err) return callback(err);
      request.post({
        url: 'https://speech.platform.bing.com/recognize/query',
        qs: {
          'scenarios': 'ulm',
          'appid': 'D4D52672-91D7-4C74-8AD8-42B1D98141A5', // This magic value is required
          'locale': 'de-de',
          'device.os': 'wp7',
          'version': '3.0',
          'format': 'json',
          'requestid': '1d4b6030-9099-11e0-91e4-0800200c9a66', // can be anything
          'instanceid': '1d4b6030-9099-11e0-91e4-0800200c9a66' // can be anything
        },
        body: waveData,
        headers: {
          'Authorization': 'Bearer ' + accessToken,
          'Content-Type': 'audio/wav; samplerate=16000',
          'Content-Length' : waveData.length
        }
      }, function(err, resp, body) {
        if(err) return callback(err);
        try {
          callback(null, JSON.parse(body));
        } catch(e) {
          callback(e);
        }
      });
    });
  }
