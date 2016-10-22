import Graph from './graph';

export default {
  twoSatArray2Graph: twoSatArray2Graph,
  isSatisfiable: isSatisfiable
};

function isSatisfiable(twoSatArray) {
  var g = twoSatArray2Graph(twoSatArray),
    nn = g.ns.length / 2,
    labels = Graph.sccKosaraju(g);
  for (var i = 0; i < nn; i++) {
    if (labels[i] === labels[i + nn]) {
      return false;
    }
  }
  return true;
}

function twoSatArray2Graph(twoSatArray) {
  var vn = 0;
  for (let [vidx1, vidx2] of twoSatArray) {
    vn = Math.max(vn, Math.abs(vidx1));
    vn = Math.max(vn, Math.abs(vidx2));
  }

  var edges = [];
  for (let [vidx1, vidx2] of twoSatArray) {
    edges.push({ source: vidx2nidx(-vidx1, vn), target: vidx2nidx(vidx2, vn) });
    edges.push({ source: vidx2nidx(-vidx2, vn), target: vidx2nidx(vidx1, vn) });
  }

  return Graph.makeGraphFromEdges(edges, true, false);
}

function vidx2nidx(vidx, vn) {
  if (vidx > 0) {
    return vidx - 1;
  } else {
    return -vidx - 1 + vn;
  }
}
