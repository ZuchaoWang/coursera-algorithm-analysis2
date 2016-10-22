import 'babel-polyfill';
import UnionFind from './unionfind';
import Heap from './heap';

export default {
  makeGraphFromEdges: makeGraphFromEdges,
  addDummySourceNode: addDummySourceNode,
  clone: clone,
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
      ns[i] = { idx: i, outnbs: [] };
    } else {
      ns[i] = { idx: i, nbs: [] };
    }
  }

  var es = new Array(wedges.length);
  for (i = 0; i < wedges.length; i++) {
    es[i] = {
      idx: i,
      source: wedges[i].source,
      target: wedges[i].target,
      props: weighted ? { w: wedges[i].w } : { w: 1 }
    };
    if (directed) {
      ns[wedges[i].source].outnbs.push({
        nidx: wedges[i].target,
        eidx: i
      });
    } else {
      ns[wedges[i].source].nbs.push({
        nidx: wedges[i].target,
        eidx: i
      });
      ns[wedges[i].target].nbs.push({
        nidx: wedges[i].source,
        eidx: i
      });
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
      outnbs: []
    };
    if (nFunc) {
      nFunc(node);
    }
    g.ns.push(node);
    for (i = 0; i < nn; i++) {
      g.ns[nn].outnbs.push({
        nidx: i,
        eidx: en + i
      });
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
      nbs: []
    };
    if (nFunc) {
      nFunc(node);
    }
    g.ns.push(node);
    for (i = 0; i < nn; i++) {
      g.ns[nn].nbs.push({
        nidx: i,
        eidx: en + i
      });
      g.ns[i].nbs.push({
        nidx: nn,
        eidx: en + i
      });
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

function clone(g) {
  var nn = g.ns.length,
    en = g.es.length,
    ns = new Array(nn),
    es = new Array(en),
    i, j;

  if (g.directed) {
    for (i = 0; i < nn; i++) {
      ns[i] = { idx: i, outnbs: [] };
      for (j = 0; j < g.ns[i].outnbs.length; j++) {
        ns[i].outnbs.push({
          nidx: g.ns[i].outnbs[j].nidx,
          eidx: g.ns[i].outnbs[j].eidx
        });
      }
    }
  } else {
    for (i = 0; i < nn; i++) {
      ns[i] = { idx: i, nbs: [] };
      for (j = 0; j < g.ns[i].nbs.length; j++) {
        ns[i].nbs.push({
          nidx: g.ns[i].nbs[j].nidx,
          eidx: g.ns[i].nbs[j].eidx
        });
      }
    }
  }

  for (i = 0; i < en; i++) {
    es[i] = {
      idx: i,
      source: g.es[i].source,
      target: g.es[i].target,
      props: Object.assign({}, g.es[i].props) // props will be shallow copy
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
    g.ns[i].outnbs = [];
  }

  for (i = 0; i < en; i++) {
    edge = g.es[i];
    [edge.source, edge.target] = [edge.target, edge.source];
    g.ns[edge.source].outnbs.push({ nidx: edge.target, eidx: i });
  }

  return g;
}

function dfs(g, nOrder, cbLeader, cbPre, cbPost) {
  var nn = g.ns.length,
    anynbs = g.directed ? 'outnbs' : 'nbs',
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
          nnb = g.ns[pc.cur][anynbs].length,
          j = pc.nbChecked;
        while (j < nnb) {
          var next = g.ns[pc.cur][anynbs][j].nidx;
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
        if (j === nnb) {
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
    for (var i = 0; i < g.ns[minNidx].nbs.length; i++) {
      var nb = g.ns[minNidx].nbs[i],
        nextNidx = nb.nidx,
        nextEidx = nb.eidx;

      // restrict target neighbours that are not added
      if (!nadded.has(nextNidx)) {
        if (nfrontier.hasKey(nextNidx)) {
          var prevElem = nfrontier.getKey(nextNidx);
          if (g.es[nextEidx].props.w < prevElem.w) {
            nfrontier.deleteKey(nextNidx);
            nfrontier.push({ nidx: nextNidx, eidx: nextEidx, w: g.es[nextEidx].props.w });
          }
        } else { // previously unreachable
          nfrontier.push({ nidx: nextNidx, eidx: nextEidx, w: g.es[nextEidx].props.w });
        }
      }
    }
  }

  return eadded;
}

function mstKruskal(g) {
  var nn = g.ns.length,
    uf = UnionFind.init(nn),
    eSorted = g.es.slice(0).sort((a, b) => a.props.w - b.props.w);

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
    for (i = 0; i < g.ns[minNidx].outnbs.length; i++) {
      var outnb = g.ns[minNidx].outnbs[i],
        nextNidx = outnb.nidx,
        nextEidx = outnb.eidx;

      if (disArray[nextNidx] == null) { // not done
        if (nfrontier.hasKey(nextNidx)) {
          var prevElem = nfrontier.getKey(nextNidx);
          if (disArray[minNidx] + g.es[nextEidx].props.w < prevElem.w) {
            nfrontier.deleteKey(nextNidx);
            nfrontier.push({ nidx: nextNidx, w: disArray[minNidx] + g.es[nextEidx].props.w });
          }
        } else {
          nfrontier.push({ nidx: nextNidx, w: disArray[minNidx] + g.es[nextEidx].props.w });
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
        for (var j = 0; j < g.ns[curNidx].outnbs.length; j++) {
          var outnb = g.ns[curNidx].outnbs[j],
            nextNidx = outnb.nidx,
            nextEidx = outnb.eidx;
          if (disArray[nextNidx] == null || prevDisArray[curNidx] + g.es[nextEidx].props.w < disArray[nextNidx]) {
            disArray[nextNidx] = prevDisArray[curNidx] + g.es[nextEidx].props.w;
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
  var gDummy = addDummySourceNode(clone(g), null, e => {
    e.props = { w: 0 };
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

  if (debug) {
    console.log('apspJohnson: re-weighting each edge ...');
  }

  // re-weight each edge and make it non-negative
  var gRW = clone(g),
    i;
  for (i = 0; i < gRW.es.length; i++) {
    var edge = gRW.es[i];
    edge.props.w = edge.props.w + nodeWeights[edge.source] - nodeWeights[edge.target];
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
    sum += g.es[eidices[i]].props.w;
  }
  return sum;
}
