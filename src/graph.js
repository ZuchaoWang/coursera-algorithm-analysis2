import 'babel-polyfill';
import UnionFind from './unionfind';
import Heap from './heap';

export default {
  makeGraphFromWeightedEdges: makeGraphFromWeightedEdges,
  mstPrim: mstPrim,
  mstKruskal: mstKruskal,
  sumOfEdgeWeight: sumOfEdgeWeight
};

function makeGraphFromWeightedEdges(wedges) {
  var nn = 0,
    i;
  for (i = 0; i < wedges.length; i++) {
    nn = Math.max(nn, wedges[i].from + 1);
    nn = Math.max(nn, wedges[i].to + 1);
  }

  var ns = new Array(nn);
  for (i = 0; i < nn; i++) {
    ns[i] = { idx: i, nbs: [] };
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
    ns[wedges[i].from].nbs.push({
      nidx: wedges[i].to,
      eidx: i
    });
    ns[wedges[i].to].nbs.push({
      nidx: wedges[i].from,
      eidx: i
    });
  }

  return {
    ns: ns,
    es: es
  };
}

function mstPrim(g) {
  if (g.ns.length === 0) {
    return {
      nindices: [],
      eindices: []
    };
  }

  // nodes are in nvisited, or nfrontier (reachable but not visited), or neither (currently not reachable)
  var nvisited = new Set(),
    evisited = [],
    nfrontier = new Heap((a, b) => a.w - b.w, a => a.nidx), // key: nidx, value: eidx (with least weight)
    firstNode = true;

  while (firstNode || nfrontier.size() > 0) {
    var minNidx;
    if (firstNode) {
      // choose first
      firstNode = false;
      minNidx = 0;

      // record visited
      nvisited.add(minNidx);
    } else {
      // choose min
      var minElem = nfrontier.pop(),
        minEidx = minElem.eidx;
      minNidx = minElem.nidx;

      // record visited
      nvisited.add(minNidx);
      evisited.push(minEidx);
    }

    // for all neighbours
    for (var i = 0; i < g.ns[minNidx].nbs.length; i++) {
      var nb = g.ns[minNidx].nbs[i],
        nextNidx = nb.nidx,
        nextEidx = nb.eidx;

      // restrict to unvisited neighbours
      if (!nvisited.has(nextNidx)) {
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

  return {
    nindices: Array.from(nvisited),
    eindices: evisited
  };
}

function mstKruskal(g) {
  var nn = g.ns.length,
    uf = UnionFind.init(nn),
    eSorted = g.es.slice(0).sort((a, b) => a.props.w - b.props.w),
    i;

  var nindices = [];
  for (i = 0; i < nn; i++) {
    nindices.push(i);
  }

  var eindices = [];
  for (i = 0; i < eSorted.length; i++) {
    var e = eSorted[i],
      fromRoot = UnionFind.find(uf, e.from),
      toRoot = UnionFind.find(uf, e.to);
    if (fromRoot !== toRoot) {
      UnionFind.union(uf, e.from, e.to);
      eindices.push(e.idx);
    }
  }

  return {
    nindices: nindices,
    eindices: eindices
  };
}

function sumOfEdgeWeight(g, eidices) {
  var sum = 0;
  for (var i = 0; i < eidices.length; i++) {
    sum += g.es[eidices[i]].props.w;
  }
  return sum;
}
