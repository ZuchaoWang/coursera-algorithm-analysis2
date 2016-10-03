import Graph from '../src/graph';

describe('graph', () => {
  describe('minimum spanning tree (mst)', () => {
    it('mstPrim should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromWeightedEdges(t, false);
        return Graph.mstPrim(g).sort((a, b) => a - b);
      }
      var d = genTestData();
      expect(_testOne(d.g1)).toEqual([0, 1, 4]);
      expect(_testOne(d.g2)).toEqual([0, 1, 2, 4]);
      expect(_testOne(d.g3)).toEqual([1, 2, 6, 8]);
    });

    it('mstKruskal should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromWeightedEdges(t, false);
        return Graph.mstKruskal(g).sort((a, b) => a - b);
      }
      var d = genTestData();
      expect(_testOne(d.g1)).toEqual([0, 1, 4]);
      expect(_testOne(d.g2)).toEqual([0, 1, 2, 4]);
      expect(_testOne(d.g3)).toEqual([1, 2, 6, 8]);
    });
  });

  describe('single source shortest path (sssp)', () => {
    it('ssspDijkstra should be correct', () => {
      function _testOne(t, s) {
        var g = Graph.makeGraphFromWeightedEdges(t, true);
        return Graph.ssspDijkstra(g, s);
      }
      var d = genTestData();
      expect(_testOne(d.g1, 0)).toEqual([0, 1, 2, 3]);
      expect(_testOne(d.g1, 1)).toEqual([null, 0, 3, 2]);
      expect(_testOne(d.g4, 0)).toEqual([0, 1, 2, 3, 4, 4, 3, 2]);
      expect(_testOne(d.g5, 0)).toEqual([0, 8, 8, 6]);
    });

    it('ssspBellmanFord should be correct', () => {
      function _testOne(t, s) {
        var g = Graph.makeGraphFromWeightedEdges(t, true);
        return Graph.ssspBellmanFord(g, s);
      }
      var d = genTestData();
      expect(_testOne(d.g1, 0)).toEqual([0, 1, 2, 3]);
      expect(_testOne(d.g1, 1)).toEqual([null, 0, 3, 2]);
      expect(_testOne(d.g4, 0)).toEqual([0, 1, 2, 3, 4, 4, 3, 2]);
      expect(_testOne(d.g5, 0)).toEqual([0, 8, 8, 6]);
      expect(_testOne(d.g6, 0)).toEqual(null);
      expect(_testOne(d.g7, 0)).toEqual([0, -5, -4, -3, -10003, -10]);
      expect(_testOne(d.g8, 0)).toEqual([0, -5, -2, 2]);
    });
  });
});

function genTestData() {
  var g1 = [ // for both mst, sssp
      { from: 0, to: 1, w: 1 },
      { from: 0, to: 2, w: 2 },
      { from: 1, to: 2, w: 3 },
      { from: 1, to: 3, w: 2 },
      { from: 2, to: 3, w: 1 }
    ],
    g2 = [ // for mst, positive
      { from: 0, to: 1, w: 2 },
      { from: 0, to: 3, w: 6 },
      { from: 1, to: 2, w: 3 },
      { from: 1, to: 3, w: 8 },
      { from: 1, to: 4, w: 5 },
      { from: 2, to: 4, w: 7 },
      { from: 3, to: 4, w: 9 }
    ],
    g3 = [ // for mst, negative
      { from: 2, to: 1, w: 98 },
      { from: 4, to: 2, w: -60 },
      { from: 0, to: 3, w: -98 },
      { from: 0, to: 4, w: -42 },
      { from: 4, to: 3, w: 8 },
      { from: 1, to: 4, w: 83 },
      { from: 2, to: 3, w: -61 },
      { from: 2, to: 0, w: 60 },
      { from: 1, to: 3, w: -17 },
      { from: 1, to: 0, w: 79 }
    ],
    g4 = [ // for sssp
      { from: 0, to: 1, w: 1 },
      { from: 0, to: 7, w: 2 },
      { from: 1, to: 0, w: 1 },
      { from: 1, to: 2, w: 1 },
      { from: 2, to: 1, w: 1 },
      { from: 2, to: 3, w: 1 },
      { from: 3, to: 2, w: 1 },
      { from: 3, to: 4, w: 1 },
      { from: 4, to: 3, w: 1 },
      { from: 4, to: 5, w: 1 },
      { from: 5, to: 4, w: 1 },
      { from: 5, to: 6, w: 1 },
      { from: 6, to: 5, w: 1 },
      { from: 6, to: 7, w: 1 },
      { from: 7, to: 6, w: 1 },
      { from: 7, to: 0, w: 2 }
    ],
    g5 = [ // for sssp, positive cycle
      { from: 0, to: 1, w: 8 },
      { from: 1, to: 2, w: 1 },
      { from: 2, to: 0, w: 1 },
      { from: 0, to: 3, w: 6 },
      { from: 3, to: 2, w: 2 }
    ],
    g6 = [ // for sssp, negative cycle
      { from: 0, to: 1, w: -5 },
      { from: 1, to: 2, w: 2 },
      { from: 2, to: 0, w: 1 },
      { from: 0, to: 3, w: 3 },
      { from: 3, to: 2, w: -1 }
    ],
    g7 = [ // for sssp, negative tree
      { from: 0, to: 1, w: -5 },
      { from: 0, to: 5, w: -10 },
      { from: 1, to: 2, w: 1 },
      { from: 2, to: 3, w: 1 },
      { from: 3, to: 4, w: -10000 }
    ],
    g8 = [ // for sssp, negative graph
      { from: 0, to: 3, w: 2 },
      { from: 1, to: 2, w: 3 },
      { from: 1, to: 0, w: 6 },
      { from: 2, to: 0, w: 4 },
      { from: 2, to: 3, w: 5 },
      { from: 3, to: 1, w: -7 },
      { from: 3, to: 2, w: -3 }
    ];

  return {
    g1: g1,
    g2: g2,
    g3: g3,
    g4: g4,
    g5: g5,
    g6: g6,
    g7: g7,
    g8: g8
  };
}
