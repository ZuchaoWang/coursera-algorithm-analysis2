var fs = require('fs'),
  path = require('path');
var aa2 = require('../dist/aa2');

var bitcodeK2 = aa2.clustering.bitcodeK2;

console.log('reading data ...');

var dataFilePath = path.resolve(__dirname, '../data/ClusteringBig.txt'),
  dataRows = fs.readFileSync(dataFilePath, 'utf-8').trim().split(/\r?\n/),
  data = dataRows.splice(1).map(row => {
    return row.trim().split(' ').map(function(x) {
      return parseInt(x, 10);
    });
  });

var k = bitcodeK2(data);

console.log('cluster number K:', k);
