// thanks to: https://gist.github.com/lukehoban/0ee5c1bef438dc5bd7cb
const config = require('config');
const fetch = require('node-fetch');
const fs = require('fs');
const util = require('util');
const request = require('request');

const terminal = require('oh-my-terminal');

import Record from './utils/records';
import Report from './utils/reports';

const clientId = 'test-app'; // Can be anything

let locTxt = 'text.txt'; // set where the test will be saved


const googleKey         = config.get('APIKeys.google'),
      azureKey          = config.get('APIKeys.azure');
let sensorStatus        = config.get('Dev.sensor');



if( sensorStatus == 1 ) {

  function startRecording(callback){
    let JSONlocation       = config.get('Report.location');
    let JSONfilename       = config.get('Report.filename');
    let index              = 0;

    if (fs.existsSync( JSONlocation + JSONfilename )) {
      let contents = fs.readFileSync( JSONlocation + JSONfilename );
      let jsonContent = JSON.parse(contents);

      for( index = 0; index < jsonContent.records.length; index++ ) {
        let recording_id = jsonContent.records[index].recording_id;
        index = recording_id;
      }
    }

    let startRecord = new Record( 'german', index, () => {
        console.log('recording done');
        console.log('soundfile written');

        let report = new Report(index);
    });
  }


  setTimeout(startRecording( () => {
    // speech to text
  }), 30000); // loop each 30 seconds

} else {

  console.log('sensor not active');

}
