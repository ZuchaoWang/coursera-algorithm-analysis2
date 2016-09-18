export default {
  toInt: toInt,
  toIntMutate2: toIntMutate2
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

function _mutate(intRep, bitAtP, p, n) {
  if (bitAtP) {
    return intRep - (1 << (n - p - 1));
  } else {
    return intRep + (1 << (n - p - 1));
  }
}
