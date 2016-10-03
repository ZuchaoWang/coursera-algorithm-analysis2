import 'babel-polyfill';
import UnionFind from './unionfind';
import Heap from './heap';

export default {
  makeGraphFromWeightedEdges: makeGraphFromWeightedEdges,
  addDummySourceNode: addDummySourceNode,
  clone: clone,
  mstPrim: mstPrim,
  mstKruskal: mstKruskal,
  ssspDijkstra: ssspDijkstra,
  ssspBellmanFord: ssspBellmanFord,
  apspJohnson: apspJohnson,
  sumOfEdgeWeight: sumOfEdgeWeight
};

function makeGraphFromWeightedEdges(wedges, directed = false) {
  var nn = 0,
    i;
  for (i = 0; i < wedges.length; i++) {
    nn = Math.max(nn, wedges[i].from + 1);
    nn = Math.max(nn, wedges[i].to + 1);
  }

  var ns = new Array(nn);
  for (i = 0; i < nn; i++) {
    if (directed) {
      ns[i] = { idx: i, innbs: [], outnbs: [] };
    } else {
      ns[i] = { idx: i, nbs: [] };
    }
  }

  var es = new Array(wedges.length);
  for (i = 0; i < wedges.length; i++) {
    es[i] = {
      idx: i,
      from: wedges[i].from,
      to: wedges[i].to,
      props: {
        w: wedges[i].w
      }
    };
    if (directed) {
      ns[wedges[i].from].outnbs.push({
        nidx: wedges[i].to,
        eidx: i
      });
      ns[wedges[i].to].innbs.push({
        nidx: wedges[i].from,
        eidx: i
      });
    } else {
      ns[wedges[i].from].nbs.push({
        nidx: wedges[i].to,
        eidx: i
      });
      ns[wedges[i].to].nbs.push({
        nidx: wedges[i].from,
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

function addDummySourceNode(g, props) {
  var nn = g.ns.length,
    en = g.es.length,
    i;

  if (g.directed) {
    g.ns.push({
      idx: nn,
      innbs: [],
      outnbs: []
    });
    for (i = 0; i < nn; i++) {
      g.ns[nn].outnbs.push({
        nidx: i,
        eidx: en + i
      });
      g.ns[i].innbs.push({
        nidx: nn,
        eidx: en + i
      });
      g.es.push({
        idx: en + i,
        from: nn,
        to: i,
        props: Object.assign({}, props)
      });
    }
  } else {
    g.ns.push({
      idx: nn,
      nbs: []
    });
    for (i = 0; i < nn; i++) {
      g.ns[nn].nbs.push({
        nidx: i,
        eidx: en + i
      });
      g.ns[i].nbs.push({
        nidx: nn,
        eidx: en + i
      });
      g.es.push({
        idx: en + i,
        from: nn,
        to: i,
        props: Object.assign({}, props)
      });
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
      ns[i] = { idx: i, innbs: [], outnbs: [] };
      for (j = 0; j < g.ns[i].outnbs.length; j++) {
        ns[i].outnbs.push({
          nidx: g.ns[i].outnbs[j].nidx,
          eidx: g.ns[i].outnbs[j].eidx
        });
      }
      for (j = 0; j < g.ns[i].innbs.length; j++) {
        ns[i].innbs.push({
          nidx: g.ns[i].innbs[j].nidx,
          eidx: g.ns[i].innbs[j].eidx
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
      from: g.es[i].from,
      to: g.es[i].to,
      props: Object.assign({}, g.es[i].props) // props will be shallow copy
    };
  }

  return {
    directed: g.directed,
    ns: ns,
    es: es
  };
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

      // restrict to neighbours that are not added
      if (!nadded.has(nextNidx)) {
        if (nfrontier.hasKey(nextNidx)) {
          var prevElem = nfrontier.getKey(nextNidx);
          if (g.es[nextEidx].props.w < prevElem.w) {
            nfrontier.popKey(nextNidx);
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
      fromRoot = UnionFind.find(uf, e.from),
      toRoot = UnionFind.find(uf, e.to);
    if (fromRoot !== toRoot) {
      UnionFind.union(uf, e.from, e.to);
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
      // start from s
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
            nfrontier.popKey(nextNidx);
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

function ssspBellmanFord(g, s) {
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
  }

  for (i = 0; i < nn; i++) {
    if (prevDisArray[i] !== disArray[i]) {
      return null; // negative cycle detected
    }
  }

  return disArray;
}

function apspJohnson(g) {
  // add dummy nodes
  var gDummy = addDummySourceNode(clone(g), { w: 0 });

  // calculate node weight
  var nn = g.ns.length,
    nodeWeights = ssspBellmanFord(gDummy, nn);
  if (nodeWeights == null) {
    return null; // negative cycle detected
  }

  // re-weighting each edge and make it non-negative
  var gRW = clone(g),
    i;
  for (i = 0; i < gRW.es.length; i++) {
    var edge = gRW.es[i];
    edge.props.w = edge.props.w + nodeWeights[edge.from] - nodeWeights[edge.to];
  }

  // run dijkstra for each source
  var disMatrix = new Array(nn);
  for (i = 0; i < nn; i++) {
    disMatrix[i] = ssspDijkstra(gRW, i);
  }

  // restore path length
  var j;
  for (i = 0; i < nn; i++) {
    for (j = 0; j < nn; j++) {
      if (disMatrix[i][j] != null) {
        disMatrix[i][j] = disMatrix[i][j] - nodeWeights[i] + nodeWeights[j];
      }
    }
  }

  return disMatrix;
}

function sumOfEdgeWeight(g, eidices) {
  var sum = 0;
  for (var i = 0; i < eidices.length; i++) {
    sum += g.es[eidices[i]].props.w;
  }
  return sum;
}
