var fs = require('fs'),
  path = require('path');
var aa2 = require('../dist/aa2');

var sortByDiff = aa2.wcomptime.sortByDiff,
  sortByRatio = aa2.wcomptime.sortByRatio,
  getWCompTime = aa2.wcomptime.getWCompTime;

console.log('reading data ...');

var dataFilePath = path.resolve(__dirname, '../data/GreedyJobs.txt'),
  dataRows = fs.readFileSync(dataFilePath, 'utf-8').trim().split(/\r?\n/),
  data = dataRows.splice(1).map(row => {
    var rowSplit = row.split(' ');
    return { w: parseInt(rowSplit[0], 10), l: parseInt(rowSplit[1], 10) };
  });

console.log('sort by diff:', getWCompTime(sortByDiff(data)));
console.log('sort by ratio:', getWCompTime(sortByRatio(data)));
