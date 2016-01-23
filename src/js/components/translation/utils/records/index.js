const config = require('config');
const fs = require('fs');
const rec = require('node-record-lpcm16');

export default class Record {
  constructor( languageInput, recordID, callback ) {

    this.language       = languageInput;
    this.id             = recordID;

    this.location       = config.get('Audio.location');
    this.filename       = config.get('Audio.filename');
    this.sampleRate     = config.get('Audio.sampleRate');
    this.maxRecTime     = config.get('Audio.maxRecordingTime');

    let file = fs.createWriteStream(this.location + this.filename + this.id + '.wav', { encoding: 'binary' });
    rec.start({ sampleRate: this.sampleRate, verbose: true }).pipe(file);

    setTimeout(function () {
      rec.stop();
      callback();
    }, this.maxRecTime); // stop after 10 seconds

  }
}
