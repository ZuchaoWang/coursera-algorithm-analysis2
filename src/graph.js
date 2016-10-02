import 'babel-polyfill';
import UnionFind from './unionfind';

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

  var nvisited = new Set(),
    evisited = [],
    nfrontier = new Map(), // key: nidx, value: eidx (with least weight)
    firstNode = true;

  while (firstNode || nfrontier.size > 0) {
    var minNidx;
    if (firstNode) {
      // choose first
      firstNode = false;
      minNidx = 0;

      // record visited
      nvisited.add(minNidx);
    } else {
      // choose min
      var minEidx = null;
      for (var [nidx, eidx] of nfrontier) {
        if (minEidx == null || g.es[eidx].props.w < g.es[minEidx].props.w) {
          minNidx = nidx;
          minEidx = eidx;
        }
      }

      // record visited
      nvisited.add(minNidx);
      evisited.push(minEidx);

      // update nfrontier
      nfrontier.delete(minNidx);
    }

    // for all neighbours
    for (var i = 0; i < g.ns[minNidx].nbs.length; i++) {
      var nb = g.ns[minNidx].nbs[i],
        nextNidx = nb.nidx,
        nextEidx = nb.eidx;

      // restrict to unvisited neighbours
      if (!nvisited.has(nextNidx)) {
        if (nfrontier.has(nextNidx)) {
          var prevEidx = nfrontier.get(nextNidx);
          if (g.es[nextEidx].props.w < g.es[prevEidx].props.w) {
            nfrontier.set(nextNidx, nextEidx);
          }
        } else { // previously unreachable
          nfrontier.set(nextNidx, nextEidx);
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
