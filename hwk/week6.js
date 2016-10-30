var fs = require('fs'),
  path = require('path');
var aa2 = require('../dist/aa2');

// var heapdump = require('heapdump');

var isSatisfiable = aa2.twosat.isSatisfiable;
// var twoSatArray2Graph = aa2.twosat.twoSatArray2Graph;

function calculate(dataFileRelPath) {
  console.log('=================');
  console.log('reading data from:', dataFileRelPath);
  // checkMem();

  var dataFilePath = path.resolve(__dirname, dataFileRelPath),
    dataRows = fs.readFileSync(dataFilePath, 'utf-8').trim().split(/\r?\n/),
    data = dataRows.splice(1).map(row => {
      var rowSplit = row.split(' ');
      return [parseInt(rowSplit[0], 10), parseInt(rowSplit[1], 10)];
    });

  // checkMem();
  console.log('constraints:', data.length);
  console.time('time usage');
  var res = isSatisfiable(data);
  // var g = twoSatArray2Graph(data);
  // checkMem();

  // console.log('graph size:', g.ns.length, g.es.length);
  console.log('satisfiability:', res);
  console.timeEnd('time usage');
  checkMem();
}

function checkMem() {
  // heapdump.writeSnapshot('dump/' + Date.now() + '.heapsnapshot');
  var m = process.memoryUsage();
  console.log(`heap usage: ${m.heapUsed}/${m.heapTotal}/${m.rss}`);
}

calculate('../data/TwoSAT1.txt');
calculate('../data/TwoSAT2.txt');
calculate('../data/TwoSAT3.txt');
calculate('../data/TwoSAT4.txt');
calculate('../data/TwoSAT5.txt');
calculate('../data/TwoSAT6.txt');
