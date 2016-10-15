var fs = require('fs'),
  path = require('path');
var aa2 = require('../dist/aa2');

var makeGraphFromEdges = aa2.graph.makeGraphFromEdges,
  apspJohnson = aa2.graph.apspJohnson;

function calculate(dataFileRelPath, largeData = false) {
  console.log('reading data from', dataFileRelPath);

  var dataFilePath = path.resolve(__dirname, dataFileRelPath),
    dataRows = fs.readFileSync(dataFilePath, 'utf-8').trim().split(/\r?\n/),
    data = dataRows.splice(1).map(row => {
      var rowSplit = row.split(' ');
      return { from: parseInt(rowSplit[0], 10) - 1, to: parseInt(rowSplit[1], 10) - 1, w: parseInt(rowSplit[2], 10) };
    });

  console.log('calculating ...');

  var g = makeGraphFromEdges(data, true, true),
    res = apspJohnson(g, largeData, largeData),
    minDis = null;

  if (largeData) {
    minDis = res;
  } else {
    var disMatrix = res;
    if (disMatrix != null) {
      for (var i = 0; i < disMatrix.length; i++) {
        for (var j = 0; j < disMatrix[i].length; j++) {
          if (disMatrix[i][j] != null) {
            if (minDis == null || minDis > disMatrix[i][j]) {
              minDis = disMatrix[i][j];
            }
          }
        }
      }
    }
  }

  console.log('shortest shortest path length:', minDis);
}

calculate('../data/APSP1.txt');
calculate('../data/APSP2.txt');
calculate('../data/APSP3.txt');

console.time('APSP4');
calculate('../data/APSP4.txt', true);
console.timeEnd('APSP4');
