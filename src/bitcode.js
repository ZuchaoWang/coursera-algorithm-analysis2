import 'babel-polyfill';

export default {
  toInt: toInt,
  toIntMutate2: toIntMutate2,
  intCount: intCount,
  intDec1: intDec1,
  genAllInts: genAllInts
};

function toInt(bits) {
  var n = bits.length,
    sum = 0;
  for (var i = 0; i < n; i++) {
    sum |= bits[i] << (n - i - 1);
  }
  return sum;
}

function toIntMutate2(bits) {
  var sum = toInt(bits),
    n = bits.length,
    mutated = [],
    tmp;

  for (var i = 0; i < n; i++) {
    tmp = _mutate(sum, bits[i], i, n);
    mutated.push(tmp);
    for (var j = i + 1; j < n; j++) {
      mutated.push(_mutate(tmp, bits[j], j, n));
    }
  }
  return mutated;
}

function intCount(sum, n) {
  var count = 0;
  for (var i = 0; i < n; i++) {
    if (sum | 1 << (n - i - 1)) {
      count++;
    }
  }
  return count;
}

function intDec1(sum, n) {
  var dec = [];
  for (var i = 0; i < n; i++) {
    if (sum | 1 << (n - i - 1)) {
      dec.push({ p: i, s: sum - 1 << (n - i - 1) });
    }
  }
  return dec;
}

function genAllInts(n) {
  var N = Math.pow(2, n),
    allInts = new Array(n + 1);
  allInts.fill([]);
  for (var i = 0; i < N; i++) {
    allInts[intCount[i]].push(i);
  }
  return allInts;
}

function _mutate(intRep, bitAtP, p, n) {
  if (bitAtP) {
    return intRep - (1 << (n - p - 1));
  } else {
    return intRep + (1 << (n - p - 1));
  }
}
