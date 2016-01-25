const config = require('config');
const fs = require('fs');
const rec = require('node-record-lpcm16');

export default class Record {
  constructor( options, callback ) {

    let file = fs.createWriteStream(options.location + options.filename + options.id + '.wav', { encoding: 'binary' });
    rec.start({ sampleRate: options.sampleRate, verbose: true }).pipe(file);

    setTimeout(function () {
      rec.stop();
      callback();
    }, options.maxRecTime); // stop after 10 seconds

  }
}
