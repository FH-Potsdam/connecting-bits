// thanks to: https://gist.github.com/lukehoban/0ee5c1bef438dc5bd7cb
const config = require('config');
const fetch = require('node-fetch');
const fs = require('fs');
const util = require('util');
const request = require('request');

const terminal = require('oh-my-terminal');

import Record from './utils/records';
import CreateReport from './utils/reports';

const clientId = 'test-app'; // Can be anything

let locTxt = 'text.txt'; // set where the test will be saved


const googleKey         = config.get('APIKeys.google'),
      azureKey          = config.get('APIKeys.azure');
let sensorStatus        = config.get('Dev.sensor');




function reportAudio(index) {
  let location       = config.get('Report.location');
  let filename       = config.get('Report.filename');
  let audioId        = index;
  let recordingDate  = new Date();

  let data = {
    filename: config.get('Audio.filename'),
    id: audioId,
    location: config.get('Audio.location'),
    samplerate: config.get('Audio.sampleRate'),
    maxRecordTime: config.get('Audio.maxRecordingTime'),
    recordingDate: recordingDate,
  };

  let newReport = new CreateReport(location, filename, data);
  if (!fs.existsSync( location + filename  )) {
    newReport.writeJSON();
  } else {
    newReport.extendJSON();
  }
}



// execute script
if( sensorStatus == 1 ) {

  function startRecording(callback){
    let audioReportLocation = config.get('Report.location');
    let audioReportFilename = config.get('Report.filename');
    let index               = 0;

    if (fs.existsSync( audioReportLocation + audioReportFilename )) {
      let contents = fs.readFileSync( audioReportLocation + audioReportFilename );
      let jsonContent = JSON.parse(contents);

      for( index = 0; index < Object.keys(jsonContent.results).length; index++ ) {
        index = index;
      }
    }

    // init array
    let recordingOptions = {
      language: 'german',
      id: index,
      location: config.get('Audio.location'),
      filename: config.get('Audio.filename'),
      sampleRate: config.get('Audio.sampleRate'),
      maxRecTime: config.get('Audio.maxRecordingTime')
    };

    let startRecord = new Record( recordingOptions, reportAudio(index));
  }

  console.log('recording starts after 5 seconds ... ');
  setTimeout( () => {
    startRecording();
  }, 5000); // stop after 10 seconds


} else {

  console.log('sensor not active');

}
