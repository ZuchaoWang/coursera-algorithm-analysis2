var fs = require('fs'),
  path = require('path');
var aa2 = require('../dist/aa2');

var makeGraphFromEdges = aa2.graph.makeGraphFromEdges,
  maxSpacing = aa2.clustering.maxSpacing;

console.log('reading data ...');

var dataFilePath = path.resolve(__dirname, '../data/ClusteringSmall.txt'),
  dataRows = fs.readFileSync(dataFilePath, 'utf-8').trim().split(/\r?\n/),
  data = dataRows.splice(1).map(row => {
    var rowSplit = row.split(' ');
    return { from: parseInt(rowSplit[0], 10) - 1, to: parseInt(rowSplit[1], 10) - 1, w: parseInt(rowSplit[2], 10) };
  });

var g = makeGraphFromEdges(data, false, true),
  ms = maxSpacing(g, 4);

console.log('max spacing:', ms);
