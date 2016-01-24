const config = require('config');
const fs = require('fs');


export default class CreateReport {
  constructor(location, filename, data) {

    this.data = data;
    this.location       = location;
    this.filename       = filename;

    this.newObject = { results: [] };
    this.newObject.results.push(data);

    console.log('init object');
  }

  writeJSON() {
    fs.writeFileSync( this.location + this.filename , JSON.stringify( this.newObject ));
    console.log('new JSON-file written');
  }

  extendJSON() {
    let contents = fs.readFileSync( this.location + this.filename  );
    let jsonContent = JSON.parse(contents);

    jsonContent['results'].push(this.data);
    fs.writeFileSync( this.location + this.filename, JSON.stringify(jsonContent) );
    console.log('JSON-file extended');
  }
}
