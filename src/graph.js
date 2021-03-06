import 'babel-polyfill';
import UnionFind from './unionfind';
import Heap from './heap';

export default {
  makeGraphFromEdges: makeGraphFromEdges,
  addDummySourceNode: addDummySourceNode,
  cloneTopology: cloneTopology,
  reverse: reverse,
  dfs: dfs,
  sccKosaraju: sccKosaraju,
  mstPrim: mstPrim,
  mstKruskal: mstKruskal,
  ssspDijkstra: ssspDijkstra,
  ssspBellmanFord: ssspBellmanFord,
  apspJohnson: apspJohnson,
  sumOfEdgeWeight: sumOfEdgeWeight
};

function makeGraphFromEdges(wedges, directed = false, weighted = false) {
  var nn = 0,
    i;
  for (i = 0; i < wedges.length; i++) {
    nn = Math.max(nn, wedges[i].source + 1);
    nn = Math.max(nn, wedges[i].target + 1);
  }

  var ns = new Array(nn);
  for (i = 0; i < nn; i++) {
    if (directed) {
      ns[i] = { idx: i, olinks: [] };
    } else {
      ns[i] = { idx: i, links: [] };
    }
  }

  var es = new Array(wedges.length);
  for (i = 0; i < wedges.length; i++) {
    es[i] = {
      idx: i,
      source: wedges[i].source,
      target: wedges[i].target,
      w: weighted ? wedges[i].w : 1
    };
    if (directed) {
      ns[wedges[i].source].olinks.push(i);
    } else {
      ns[wedges[i].source].links.push(i);
      ns[wedges[i].target].links.push(i);
    }
  }

  return {
    directed: directed,
    ns: ns,
    es: es
  };
}

function addDummySourceNode(g, nFunc, eFunc) {
  var nn = g.ns.length,
    en = g.es.length,
    node,
    edge,
    i;

  if (g.directed) {
    node = {
      idx: nn,
      olinks: []
    };
    if (nFunc) {
      nFunc(node);
    }
    g.ns.push(node);
    for (i = 0; i < nn; i++) {
      g.ns[nn].olinks.push(en + i);
      edge = {
        idx: en + i,
        source: nn,
        target: i
      };
      if (eFunc) {
        eFunc(edge);
      }
      g.es.push(edge);
    }
  } else {
    node = {
      idx: nn,
      links: []
    };
    if (nFunc) {
      nFunc(node);
    }
    g.ns.push(node);
    for (i = 0; i < nn; i++) {
      g.ns[nn].links.push(en + i);
      g.ns[i].links.push(en + i);
      edge = {
        idx: en + i,
        source: nn,
        target: i
      };
      if (eFunc) {
        eFunc(edge);
      }
      g.es.push(edge);
    }
  }

  return g;
}

function cloneTopology(g) {
  var nn = g.ns.length,
    en = g.es.length,
    ns = new Array(nn),
    es = new Array(en),
    i;

  if (g.directed) {
    for (i = 0; i < nn; i++) {
      ns[i] = { idx: i, olinks: g.ns[i].olinks.slice(0) };
    }
  } else {
    for (i = 0; i < nn; i++) {
      ns[i] = { idx: i, links: g.ns[i].links.slice(0) };
    }
  }

  for (i = 0; i < en; i++) {
    es[i] = {
      idx: i,
      source: g.es[i].source,
      target: g.es[i].target,
      w: g.es[i].w
    };
  }

  return {
    directed: g.directed,
    ns: ns,
    es: es
  };
}

function reverse(g) {
  if (!g.directed) {
    return g;
  }

  var nn = g.ns.length,
    en = g.es.length,
    edge,
    i;

  for (i = 0; i < nn; i++) {
    g.ns[i].olinks = [];
  }

  for (i = 0; i < en; i++) {
    edge = g.es[i];
    [edge.source, edge.target] = [edge.target, edge.source];
    g.ns[edge.source].olinks.push(i);
  }

  return g;
}

function dfs(g, nOrder, cbLeader, cbPre, cbPost) {
  var nn = g.ns.length,
    anylinks = g.directed ? 'olinks' : 'links',
    stack = [],
    visited = new Array(nn),
    i;
  visited.fill(false);

  if (!nOrder) {
    nOrder = new Array(nn);
    for (i = 0; i < nn; i++) {
      nOrder[i] = i;
    }
  }

  for (i = 0; i < nOrder.length; i++) {
    var cur = nOrder[i];
    if (!visited[cur]) {
      visited[cur] = true;
      if (cbLeader) {
        cbLeader(cur);
      }
      if (cbPre) {
        cbPre(cur);
      }
      stack.push({ cur: cur, nbChecked: 0 });
      while (stack.length) {
        var pc = stack.pop(),
          nl = g.ns[pc.cur][anylinks].length,
          j = pc.nbChecked;
        while (j < nl) {
          var nextLink = g.es[g.ns[pc.cur][anylinks][j]],
            next = (nextLink.target === pc.cur) ? nextLink.source : nextLink.target;
          if (!visited[next]) {
            stack.push({ cur: pc.cur, nbChecked: j + 1 });
            visited[next] = true;
            if (cbPre) {
              cbPre(next);
            }
            stack.push({ cur: next, nbChecked: 0 });
            break;
          }
          j++;
        }
        if (j === nl) {
          if (cbPost) {
            cbPost(pc.cur);
          }
        }
      }
    }
  }
}

function sccKosaraju(g) {
  var nn = g.ns.length,
    order = [],
    gRev = reverse(g);

  dfs(gRev, null, null, null,
    i => {
      order.push(i);
    });
  order = order.reverse();

  var gOri = reverse(gRev),
    labels = new Array(nn),
    compCount = 0;
  dfs(gOri, order,
    i => {
      compCount++;
    },
    i => {
      labels[i] = compCount - 1;
    }, null);

  return labels;
}

function mstPrim(g) {
  if (g.ns.length === 0) {
    return [];
  }

  // nodes are in nadded, or nfrontier (reachable but not added), or neither (currently not reachable)
  var nadded = new Set(),
    eadded = [],
    nfrontier = new Heap((a, b) => a.w - b.w, a => a.nidx), // nidx, eidx, w
    firstNode = true;

  while (firstNode || nfrontier.size() > 0) {
    var minNidx;
    if (firstNode) {
      // choose first
      firstNode = false;
      minNidx = 0;

      // record visited
      nadded.add(minNidx);
    } else {
      // choose min
      var minElem = nfrontier.pop(),
        minEidx = minElem.eidx;
      minNidx = minElem.nidx;

      // record visited
      nadded.add(minNidx);
      eadded.push(minEidx);
    }

    // for all neighbours
    for (var i = 0; i < g.ns[minNidx].links.length; i++) {
      var nextEidx = g.ns[minNidx].links[i],
        nextNidx = (g.es[nextEidx].target === minNidx) ? g.es[nextEidx].source : g.es[nextEidx].target;

      // restrict target neighbours that are not added
      if (!nadded.has(nextNidx)) {
        if (nfrontier.hasKey(nextNidx)) {
          var prevElem = nfrontier.getKey(nextNidx);
          if (g.es[nextEidx].w < prevElem.w) {
            nfrontier.deleteKey(nextNidx);
            nfrontier.push({ nidx: nextNidx, eidx: nextEidx, w: g.es[nextEidx].w });
          }
        } else { // previously unreachable
          nfrontier.push({ nidx: nextNidx, eidx: nextEidx, w: g.es[nextEidx].w });
        }
      }
    }
  }

  return eadded;
}

function mstKruskal(g) {
  var nn = g.ns.length,
    uf = UnionFind.init(nn),
    eSorted = g.es.slice(0).sort((a, b) => a.w - b.w);

  var eadded = [];
  for (var i = 0; i < eSorted.length; i++) {
    var e = eSorted[i],
      sourceRoot = UnionFind.find(uf, e.source),
      targetRoot = UnionFind.find(uf, e.target);
    if (sourceRoot !== targetRoot) {
      UnionFind.union(uf, e.source, e.target);
      eadded.push(e.idx);
    }
  }

  return eadded;
}

function ssspDijkstra(g, s) {
  var nn = g.ns.length,
    disArray = new Array(nn),
    nfrontier = new Heap((a, b) => a.w - b.w, a => a.nidx), // nidx, eidx, w
    firstNode = true,
    i;

  for (i = 0; i < nn; i++) {
    disArray[i] = null;
  }

  while (firstNode || nfrontier.size() > 0) {
    var minNidx;
    if (firstNode) {
      // start source s
      firstNode = false;
      minNidx = s;
      disArray[minNidx] = 0;
    } else {
      // choose min
      var minElem = nfrontier.pop();
      minNidx = minElem.nidx;
      disArray[minNidx] = minElem.w;
    }

    // for all neighbours
    for (i = 0; i < g.ns[minNidx].olinks.length; i++) {
      var nextEidx = g.ns[minNidx].olinks[i],
        nextNidx = (g.es[nextEidx].target === minNidx) ? g.es[nextEidx].source : g.es[nextEidx].target;

      if (disArray[nextNidx] == null) { // not done
        if (nfrontier.hasKey(nextNidx)) {
          var prevElem = nfrontier.getKey(nextNidx);
          if (disArray[minNidx] + g.es[nextEidx].w < prevElem.w) {
            nfrontier.deleteKey(nextNidx);
            nfrontier.push({ nidx: nextNidx, w: disArray[minNidx] + g.es[nextEidx].w });
          }
        } else {
          nfrontier.push({ nidx: nextNidx, w: disArray[minNidx] + g.es[nextEidx].w });
        }
      }
    }
  }

  return disArray;
}

function ssspBellmanFord(g, s, debug = false) {
  var nn = g.ns.length,
    prevDisArray = [],
    disArray = new Array(nn),
    i;

  for (i = 0; i < nn; i++) {
    disArray[i] = null;
  }
  disArray[s] = 0;

  // n iterations
  for (var k = 0; k < nn; k++) {
    prevDisArray = disArray.slice(0);
    // for all nodes
    for (var curNidx = 0; curNidx < nn; curNidx++) {
      if (prevDisArray[curNidx] != null) {
        // for all neighbours
        for (var j = 0; j < g.ns[curNidx].olinks.length; j++) {
          var nextEidx = g.ns[curNidx].olinks[j],
            nextNidx = (g.es[nextEidx].target === curNidx) ? g.es[nextEidx].source : g.es[nextEidx].target;
          if (disArray[nextNidx] == null || prevDisArray[curNidx] + g.es[nextEidx].w < disArray[nextNidx]) {
            disArray[nextNidx] = prevDisArray[curNidx] + g.es[nextEidx].w;
          }
        }
      }
    }
    if (debug && Math.floor((k + 1) * 100 / nn) > Math.floor(k * 100 / nn)) {
      console.log(`ssspBellmanFord: completed ${k + 1}/${nn} rounds`);
    }
  }

  for (i = 0; i < nn; i++) {
    if (prevDisArray[i] !== disArray[i]) {
      return null; // negative cycle detected
    }
  }

  return disArray;
}

function apspJohnson(g, minDisOnly = false, debug = false) {
  if (debug) {
    console.log('apspJohnson: adding dummy nodes ...');
  }

  // add dummy nodes
  var gDummy = addDummySourceNode(cloneTopology(g), null, e => {
    e.w = 0;
  });

  if (debug) {
    console.log('apspJohnson: calculating node weight ...');
  }

  // calculate node weight
  var nn = g.ns.length,
    nodeWeights = ssspBellmanFord(gDummy, nn, debug);
  if (nodeWeights == null) {
    return null; // negative cycle detected
  }
  gDummy = null; // to allow memory release

  if (debug) {
    console.log('apspJohnson: re-weighting each edge ...');
  }

  // re-weight each edge and make it non-negative
  var gRW = cloneTopology(g),
    i;
  for (i = 0; i < gRW.es.length; i++) {
    var edge = gRW.es[i];
    edge.w = edge.w + nodeWeights[edge.source] - nodeWeights[edge.target];
  }

  if (debug) {
    console.log('apspJohnson: runing dijkstra for each source ...');
  }

  // run dijkstra for each source and restargetre path length
  var disMatrix = new Array(nn),
    minDis = null,
    j;
  for (i = 0; i < nn; i++) {
    var disArray = ssspDijkstra(gRW, i);
    for (j = 0; j < nn; j++) {
      if (disArray[j] != null) {
        disArray[j] = disArray[j] - nodeWeights[i] + nodeWeights[j];
        if (minDis == null || minDis > disArray[j]) {
          minDis = disArray[j];
        }
      }
    }
    if (!minDisOnly) {
      disMatrix[i] = disArray;
    }
    if (debug && Math.floor((i + 1) * 100 / nn) > Math.floor(i * 100 / nn)) {
      console.log(`apspJohnson: completed ${i + 1}/${nn} sources`);
    }
  }

  return minDisOnly ? minDis : disMatrix;
}

function sumOfEdgeWeight(g, eidices) {
  var sum = 0;
  for (var i = 0; i < eidices.length; i++) {
    sum += g.es[eidices[i]].w;
  }
  return sum;
}
