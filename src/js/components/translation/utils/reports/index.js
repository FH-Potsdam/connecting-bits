const config = require('config');
const fs = require('fs');

export default class Report {
  constructor(index){

    this.location       = config.get('Report.location');
    this.filename       = config.get('Report.filename');

    this.audioId        = index;

    this.audioLocation  = config.get('Audio.location');
    this.audioFilename  = config.get('Audio.filename');
    this.sampleRate     = config.get('Audio.sampleRate');
    this.maxRecTime     = config.get('Audio.maxRecordingTime');
    this.recordingDate  = new Date();

    this.prepareJSON();

  }

  prepareJSON() {
    console.log('peparing report file');

    let recordStorage = {
      records: [{
        filename: this.audioFilename + '_' + this.audioId + '.wav',
        location: this.audiolocation,
        recording_id: this.audioId.toString(),
        //languageInput: this.language,
        sampleRate: this.sampleRate.toString(),
        timestamp: this.recordingDate
      }]
    };

    this.writeJSON(recordStorage)
  }

  writeJSON(recordStorage) {
    if (!fs.existsSync( this.location + this.filename  )) {
      fs.writeFileSync( this.location + this.filename , JSON.stringify( recordStorage ));
      console.log('new JSON-file written');
    } else {
      // Get content from file
      let contents = fs.readFileSync( this.location + this.filename  );
      // Define to JSON type
      let jsonContent = JSON.parse(contents);

      // pushing new record to json
      jsonContent['records'].push(
        {
          filename: this.audioFilename + '_' + '.wav',
          location: this.audiolocation,
          recording_id: this.audioId.toString(),
          //languageInput: this.language,
          sampleRate: this.sampleRate.toString(),
          timestamp: this.recordingDate
        }
      );
      // Write file
      fs.writeFileSync( this.location + this.filename, JSON.stringify(jsonContent) );
      console.log('JSON-file extended');
      console.log(jsonContent);
    }
  }
}
