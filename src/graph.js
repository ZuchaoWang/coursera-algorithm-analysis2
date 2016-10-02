import 'babel-polyfill';
import UnionFind from './unionfind';
import Heap from './heap';

export default {
  makeGraphFromWeightedEdges: makeGraphFromWeightedEdges,
  mstPrim: mstPrim,
  mstKruskal: mstKruskal,
  ssspDijkstra: ssspDijkstra,
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
      var nb = g.ns[minNidx].outnbs[i],
        nextNidx = nb.nidx,
        nextEidx = nb.eidx;

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

function sumOfEdgeWeight(g, eidices) {
  var sum = 0;
  for (var i = 0; i < eidices.length; i++) {
    sum += g.es[eidices[i]].props.w;
  }
  return sum;
}
