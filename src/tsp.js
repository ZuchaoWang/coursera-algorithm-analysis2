import Bitcode from './bitcode';

export default {
  geoDisMatrix: geoDisMatrix,
  tsp: tsp
};

function geoDisMatrix(pos) {
  var n = pos.length,
    disMatrix = new Array(n);
  for (var i = 0; i < n; i++) {
    disMatrix[i] = new Array(n);
    for (var j = 0; j < n; j++) {
      var dx = pos[i][0] - pos[j][0],
        dy = pos[i][1] - pos[j][1];
      disMatrix[i][j] = Math.sqrt(dx * dx + dy * dy);
    }
  }
  return disMatrix;
}

function tsp(disMatrix, n, debug = false) {
  if (n <= 1) {
    return 0;
  }

  if (debug) {
    console.log('generating all combinations ...');
  }

  var N = Math.pow(2, n - 1),
    allInts = Bitcode.genAllInts(n - 1);

  var Nsub = 0,
    i;
  for (i = 0; i < allInts.length; i++) {
    Nsub = Math.max(Nsub, allInts[i].length);
  }

  var prevMapping = new Uint32Array(N),
    curMapping = new Uint32Array(N),
    prevPath = new Float32Array(Nsub * n),
    curPath = new Float32Array(Nsub * n),
    prevCount = 0,
    curCount = 0;

  if (debug) {
    console.log('running on 1 edge ...');
  }

  var j, dec;
  curCount = n - 1;
  for (j = 0; j < n - 1; j++) {
    curMapping[allInts[1][j]] = j;
  }
  curPath.fill(-1, 0, (n - 1) * n);
  for (j = 0; j < n - 1; j++) {
    dec = Bitcode.intDec1(allInts[1][j], n - 1);
    curPath[j * n + dec[0].p] = disMatrix[n - 1][dec[0].p];
  }

  var prevDis, minDis, k, l;
  for (i = 2; i < n; i++) {
    if (debug) {
      console.log(`running on ${i} edges ...`);
    }

    [prevCount, curCount] = [curCount, prevCount];
    [prevMapping, curMapping] = [curMapping, prevMapping];
    [prevPath, curPath] = [curPath, prevPath];
    curCount = allInts[i].length;
    for (j = 0; j < curCount; j++) {
      curMapping[allInts[i][j]] = j;
    }
    curPath.fill(-1, 0, curCount * n);
    for (j = 0; j < curCount; j++) {
      dec = Bitcode.intDec1(allInts[i][j], n - 1);
      for (k = 0; k < dec.length; k++) {
        // prefix-set: dec[k].s, prefix-last: l, cur-last: dec[k].p
        minDis = -1;
        for (l = 0; l < n; l++) {
          prevDis = prevPath[prevMapping[dec[k].s] * n + l];
          if (prevDis !== -1) {
            prevDis += disMatrix[l][dec[k].p];
            if (minDis === -1 || minDis > prevDis) {
              minDis = prevDis;
            }
          }
        }
        curPath[j * n + dec[k].p] = minDis;
      }
    }
  }

  if (debug) {
    console.log(`running on ${i} edges ...`);
  }

  minDis = -1;
  var curDis;
  for (i = 0; i < n - 1; i++) {
    curDis = curPath[i];
    if (curDis !== -1) {
      curDis += disMatrix[i][n - 1];
      if (minDis === -1 || minDis > curDis) {
        minDis = curDis;
      }
    }
  }
  return minDis;
}
