import 'babel-polyfill';

export default {
  knapsack: knapsack
};

function knapsack(totalWeight, vals, weights) {
  var stack = [{ n: vals.length, w: totalWeight, exclude: null, include: null }],
    cache = new Map();

  while (stack.length) {
    var prob = stack.pop();
    if (prob.n === 0 || prob.w === 0) {
      cacheSet(cache, prob.n, prob.w, 0);
    } else if (prob.exclude == null) {
      if (cacheHas(cache, prob.n - 1, prob.w)) {
        prob.exclude = cacheGet(cache, prob.n - 1, prob.w);
        stack.push(prob);
      } else {
        stack.push(prob);
        stack.push({ n: prob.n - 1, w: prob.w, exclude: null, include: null });
      }
    } else if (prob.include == null) {
      if (prob.w < weights[prob.n - 1]) {
        prob.include = 0;
        stack.push(prob);
      } else if (cacheHas(cache, prob.n - 1, prob.w - weights[prob.n - 1])) {
        prob.include = cacheGet(cache, prob.n - 1, prob.w - weights[prob.n - 1]) + vals[prob.n - 1];
        stack.push(prob);
      } else {
        stack.push(prob);
        stack.push({ n: prob.n - 1, w: prob.w - weights[prob.n - 1], exclude: null, include: null });
      }
    } else {
      cacheSet(cache, prob.n, prob.w, Math.max(prob.include, prob.exclude));
    }
  }

  return cacheGet(cache, vals.length, totalWeight);
}

function cacheHas(cache, i, w) {
  return cache.has(i) && cache.get(i).has(w);
}

function cacheSet(cache, i, w, v) {
  if (!cache.has(i)) {
    cache.set(i, new Map());
  }
  if (!cache.get(i).has(w)) {
    cache.get(i).set(w, v);
  }
}

function cacheGet(cache, i, w) {
  return cache.get(i).get(w);
}
