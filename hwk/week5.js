var fs = require('fs'),
  path = require('path');
var aa2 = require('../dist/aa2');

var geoDisMatrix = aa2.tsp.geoDisMatrix,
  tsp = aa2.tsp.tsp;

console.log('reading data ...');

var dataFilePath = path.resolve(__dirname, '../data/TSP.txt'),
  dataRows = fs.readFileSync(dataFilePath, 'utf-8').trim().split(/\r?\n/),
  data = dataRows.splice(1).map(row => {
    return row.trim().split(' ').map(function(x) {
      return parseInt(x, 10);
    });
  });

// for (var i = 5; i < 21; i++) {
//   var dataSub = data.slice(0, i);
//   var disMatrixSub = geoDisMatrix(dataSub);
//   var minTSPDisSub = tsp(disMatrixSub, i);
//   console.log(`test: i=${i}, dis=${minTSPDisSub}`);
// }

console.log('calculating distance ...');

var disMatrix = geoDisMatrix(data);

console.log('calculating tsp ...');

console.time('TSP');
var minTSPDis = tsp(disMatrix, data.length, true);
console.timeEnd('TSP');

console.log('min tsp distance:', minTSPDis);
