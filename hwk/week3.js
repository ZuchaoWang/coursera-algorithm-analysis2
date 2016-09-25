var fs = require('fs'),
  path = require('path');
var aa2 = require('../dist/aa2');

var knapsack = aa2.knapsack.knapsack;

function calculate(dataFileRelPath) {
  console.log('reading data from', dataFileRelPath);
  var dataFilePath = path.resolve(__dirname, dataFileRelPath),
    dataRows = fs.readFileSync(dataFilePath, 'utf-8').trim().split(/\r?\n/),
    firstRow = dataRows[0],
    followingRows = dataRows.splice(1),
    totalWeight = parseInt(firstRow.trim().split(' ')[0], 10),
    vals = [],
    weights = [];

  followingRows.forEach(row => {
    var rowSplit = row.trim().split(' ').map(x => parseInt(x, 10));
    vals.push(rowSplit[0]);
    weights.push(rowSplit[1]);
  });

  // console.log(totalWeight, vals, weights);

  console.log('calculating ...');
  var maxVal = knapsack(totalWeight, vals, weights);
  console.log('max val:', maxVal);
}

calculate('../data/KnapsackSmall.txt');
calculate('../data/KnapsackBig.txt');
