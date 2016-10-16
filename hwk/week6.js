var fs = require('fs'),
  path = require('path');
var aa2 = require('../dist/aa2');

var isSatisfiable = aa2.twosat.isSatisfiable;

function calculate(dataFileRelPath) {
  console.log('reading data from', dataFileRelPath);

  var dataFilePath = path.resolve(__dirname, dataFileRelPath),
    dataRows = fs.readFileSync(dataFilePath, 'utf-8').trim().split(/\r?\n/),
    data = dataRows.splice(1).map(row => {
      var rowSplit = row.split(' ');
      return [parseInt(rowSplit[0], 10), parseInt(rowSplit[1], 10)];
    });

  var res = isSatisfiable(data);

  console.log('satisfiability:', res);
}

calculate('../data/TwoSAT1.txt');
calculate('../data/TwoSAT2.txt');
// calculate('../data/TwoSAT3.txt');
// calculate('../data/TwoSAT4.txt');
// calculate('../data/TwoSAT5.txt');
// calculate('../data/TwoSAT6.txt');
