export default {
  init: init,
  union: union,
  find: find
};

function init(n) {
  var parentArr = new Array(n),
    rankArr = new Array(n);
  for (var i = 0; i < n; i++) {
    parentArr[i] = i;
    rankArr[i] = 0;
  }
  return {
    parent: parentArr,
    rank: rankArr
  };
}

function find(uf, i) {
  if (uf.parent[i] !== i) {
    uf.parent[i] = find(uf, uf.parent[i]);
  }
  return uf.parent[i];
}

function union(uf, i, j) {
  var iroot = find(uf, i),
    jroot = find(uf, j);

  if (uf.rank[iroot] < uf.rank[jroot]) {
    uf.parent[iroot] = jroot;
  } else if (uf.rank[iroot] > uf.rank[jroot]) {
    uf.parent[jroot] = iroot;
  } else {
    uf.parent[jroot] = iroot;
    uf.rank[iroot]++;
  }
}
