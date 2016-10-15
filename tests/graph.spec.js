import Graph from '../src/graph';

describe('graph', () => {
  describe('making graph', () => {
    it('makeGraphFromEdges should be correct for undirected and unweighted graph', () => {
      function _testOne(t) {
        return Graph.makeGraphFromEdges(t, false, false);
      }
      var d = genTestData();
      expect(_testOne(d.g0)).toEqual({
        directed: false,
        ns: [],
        es: []
      });
      expect(_testOne(d.g1)).toEqual({
        directed: false,
        ns: [
          { idx: 0, nbs: [{ nidx: 1, eidx: 0 }, { nidx: 2, eidx: 1 }] },
          { idx: 1, nbs: [{ nidx: 0, eidx: 0 }, { nidx: 2, eidx: 2 }, { nidx: 3, eidx: 3 }] },
          { idx: 2, nbs: [{ nidx: 0, eidx: 1 }, { nidx: 1, eidx: 2 }, { nidx: 3, eidx: 4 }] },
          { idx: 3, nbs: [{ nidx: 1, eidx: 3 }, { nidx: 2, eidx: 4 }] }
        ],
        es: [
          { idx: 0, from: 0, to: 1, props: { w: 1 } },
          { idx: 1, from: 0, to: 2, props: { w: 1 } },
          { idx: 2, from: 1, to: 2, props: { w: 1 } },
          { idx: 3, from: 1, to: 3, props: { w: 1 } },
          { idx: 4, from: 2, to: 3, props: { w: 1 } }
        ]
      });
    });

    it('makeGraphFromEdges should be correct for undirected and weighted graph', () => {
      function _testOne(t) {
        return Graph.makeGraphFromEdges(t, false, true);
      }
      var d = genTestData();
      expect(_testOne(d.g0)).toEqual({
        directed: false,
        ns: [],
        es: []
      });
      expect(_testOne(d.g1)).toEqual({
        directed: false,
        ns: [
          { idx: 0, nbs: [{ nidx: 1, eidx: 0 }, { nidx: 2, eidx: 1 }] },
          { idx: 1, nbs: [{ nidx: 0, eidx: 0 }, { nidx: 2, eidx: 2 }, { nidx: 3, eidx: 3 }] },
          { idx: 2, nbs: [{ nidx: 0, eidx: 1 }, { nidx: 1, eidx: 2 }, { nidx: 3, eidx: 4 }] },
          { idx: 3, nbs: [{ nidx: 1, eidx: 3 }, { nidx: 2, eidx: 4 }] }
        ],
        es: [
          { idx: 0, from: 0, to: 1, props: { w: 1 } },
          { idx: 1, from: 0, to: 2, props: { w: 2 } },
          { idx: 2, from: 1, to: 2, props: { w: 3 } },
          { idx: 3, from: 1, to: 3, props: { w: 2 } },
          { idx: 4, from: 2, to: 3, props: { w: 1 } }
        ]
      });
    });

    it('makeGraphFromEdges should be correct for directed and unweighted graph', () => {
      function _testOne(t) {
        return Graph.makeGraphFromEdges(t, true, false);
      }
      var d = genTestData();
      expect(_testOne(d.g0)).toEqual({
        directed: true,
        ns: [],
        es: []
      });
      expect(_testOne(d.g1)).toEqual({
        directed: true,
        ns: [
          { idx: 0, innbs: [], outnbs: [{ nidx: 1, eidx: 0 }, { nidx: 2, eidx: 1 }] },
          { idx: 1, innbs: [{ nidx: 0, eidx: 0 }], outnbs: [{ nidx: 2, eidx: 2 }, { nidx: 3, eidx: 3 }] },
          { idx: 2, innbs: [{ nidx: 0, eidx: 1 }, { nidx: 1, eidx: 2 }], outnbs: [{ nidx: 3, eidx: 4 }] },
          { idx: 3, innbs: [{ nidx: 1, eidx: 3 }, { nidx: 2, eidx: 4 }], outnbs: [] }
        ],
        es: [
          { idx: 0, from: 0, to: 1, props: { w: 1 } },
          { idx: 1, from: 0, to: 2, props: { w: 1 } },
          { idx: 2, from: 1, to: 2, props: { w: 1 } },
          { idx: 3, from: 1, to: 3, props: { w: 1 } },
          { idx: 4, from: 2, to: 3, props: { w: 1 } }
        ]
      });
    });
  });

  describe('reverse graph', () => {
    it('reverse should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromEdges(t, true, true);
        return Graph.reverse(g);
      }
      var d = genTestData();
      expect(_testOne(d.g0)).toEqual({
        directed: true,
        ns: [],
        es: []
      });
      expect(_testOne(d.g1)).toEqual({
        directed: true,
        ns: [
          { idx: 0, innbs: [{ nidx: 1, eidx: 0 }, { nidx: 2, eidx: 1 }], outnbs: [] },
          { idx: 1, innbs: [{ nidx: 2, eidx: 2 }, { nidx: 3, eidx: 3 }], outnbs: [{ nidx: 0, eidx: 0 }] },
          { idx: 2, innbs: [{ nidx: 3, eidx: 4 }], outnbs: [{ nidx: 0, eidx: 1 }, { nidx: 1, eidx: 2 }] },
          { idx: 3, innbs: [], outnbs: [{ nidx: 1, eidx: 3 }, { nidx: 2, eidx: 4 }] }
        ],
        es: [
          { idx: 0, from: 1, to: 0, props: { w: 1 } },
          { idx: 1, from: 2, to: 0, props: { w: 2 } },
          { idx: 2, from: 2, to: 1, props: { w: 3 } },
          { idx: 3, from: 3, to: 1, props: { w: 2 } },
          { idx: 4, from: 3, to: 2, props: { w: 1 } }
        ]
      });
    });
  });

  describe('depth first search', () => {
    it('dfs should be correct for undirected graph', () => {
      function _testOne(t, order = null) {
        var g = Graph.makeGraphFromEdges(t, false, false),
          leaders = [],
          pres = [],
          posts = [];
        Graph.dfs(g, order,
          i => {
            leaders.push(i);
          },
          i => {
            pres.push(i);
          },
          i => {
            posts.push(i);
          });
        return {
          leaders: leaders,
          pres: pres,
          posts: posts
        };
      }
      var d = genTestData();
      expect(_testOne(d.g0)).toEqual({
        leaders: [],
        pres: [],
        posts: []
      });
      expect(_testOne(d.g1)).toEqual({
        leaders: [0],
        pres: [0, 1, 2, 3],
        posts: [3, 2, 1, 0]
      });
      expect(_testOne(d.g1, [1])).toEqual({
        leaders: [1],
        pres: [1, 0, 2, 3],
        posts: [3, 2, 0, 1]
      });
      expect(_testOne(d.g1, [1, 2, 3, 0])).toEqual({
        leaders: [1],
        pres: [1, 0, 2, 3],
        posts: [3, 2, 0, 1]
      });
    });

    it('dfs should be correct for directed graph', () => {
      function _testOne(t, order = null) {
        var g = Graph.makeGraphFromEdges(t, true, false),
          leaders = [],
          pres = [],
          posts = [];
        Graph.dfs(g, order,
          i => {
            leaders.push(i);
          },
          i => {
            pres.push(i);
          },
          i => {
            posts.push(i);
          });
        return {
          leaders: leaders,
          pres: pres,
          posts: posts
        };
      }
      var d = genTestData();
      expect(_testOne(d.g0)).toEqual({
        leaders: [],
        pres: [],
        posts: []
      });
      expect(_testOne(d.g1)).toEqual({
        leaders: [0],
        pres: [0, 1, 2, 3],
        posts: [3, 2, 1, 0]
      });
      expect(_testOne(d.g1, [1])).toEqual({
        leaders: [1],
        pres: [1, 2, 3],
        posts: [3, 2, 1]
      });
      expect(_testOne(d.g1, [1, 2, 3, 0])).toEqual({
        leaders: [1, 0],
        pres: [1, 2, 3, 0],
        posts: [3, 2, 1, 0]
      });
    });
  });

  describe('strongly connected component (scc)', () => {
    it('sccKosaraju should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromEdges(t, true, false);
        return Graph.sccKosaraju(g);
      }
      var d = genTestData();
      expect(_testOne(d.g0)).toEqual([]);
      expect(_testOne(d.g1)).toEqual([3, 2, 1, 0]);
      expect(_testOne(d.g5)).toEqual([0, 0, 0, 0]);
      expect(_testOne(d.g9)).toEqual([3, 3, 3, 2, 0, 0, 0, 1, 1, 1, 1]);
    });
  });

  describe('minimum spanning tree (mst)', () => {
    it('mstPrim should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromEdges(t, false, true);
        return Graph.mstPrim(g).sort((a, b) => a - b);
      }
      var d = genTestData();
      expect(_testOne(d.g1)).toEqual([0, 1, 4]);
      expect(_testOne(d.g2)).toEqual([0, 1, 2, 4]);
      expect(_testOne(d.g3)).toEqual([1, 2, 6, 8]);
    });

    it('mstKruskal should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromEdges(t, false, true);
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
        var g = Graph.makeGraphFromEdges(t, true, true);
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
        var g = Graph.makeGraphFromEdges(t, true, true);
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

  describe('all pair shortest path (apsp)', () => {
    it('apspJohnson should output correct disMatrix', () => {
      function _testOne(t, s) {
        var g = Graph.makeGraphFromEdges(t, true, true);
        return Graph.apspJohnson(g, false);
      }

      var d = genTestData();
      expect(_testOne(d.g1, 0)).toEqual([
        [0, 1, 2, 3],
        [null, 0, 3, 2],
        [null, null, 0, 1],
        [null, null, null, 0]
      ]);
      expect(_testOne(d.g5, 0)).toEqual([
        [0, 8, 8, 6],
        [2, 0, 1, 8],
        [1, 9, 0, 7],
        [3, 11, 2, 0]
      ]);
      expect(_testOne(d.g6, 0)).toEqual(null);
      expect(_testOne(d.g8, 0)).toEqual([
        [0, -5, -2, 2],
        [6, 0, 3, 8],
        [4, -2, 0, 5],
        [-1, -7, -4, 0]
      ]);
    });

    it('apspJohnson should output correct minDis', () => {
      function _testOne(t, s) {
        var g = Graph.makeGraphFromEdges(t, true, true);
        return Graph.apspJohnson(g, true);
      }

      var d = genTestData();
      expect(_testOne(d.g1, 0)).toEqual(0);
      expect(_testOne(d.g5, 0)).toEqual(0);
      expect(_testOne(d.g6, 0)).toEqual(null);
      expect(_testOne(d.g8, 0)).toEqual(-7);
    });
  });
});

function genTestData() {
  var g0 = [],
    g1 = [ // for scc, mst, sssp, apsp
      { from: 0, to: 1, w: 1 },
      { from: 0, to: 2, w: 2 },
      { from: 1, to: 2, w: 3 },
      { from: 1, to: 3, w: 2 },
      { from: 2, to: 3, w: 1 }
    ],
    g2 = [ // for mst (positive)
      { from: 0, to: 1, w: 2 },
      { from: 0, to: 3, w: 6 },
      { from: 1, to: 2, w: 3 },
      { from: 1, to: 3, w: 8 },
      { from: 1, to: 4, w: 5 },
      { from: 2, to: 4, w: 7 },
      { from: 3, to: 4, w: 9 }
    ],
    g3 = [ // for mst (negative)
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
    g5 = [ // for scc, sssp, apsp (positive cycle)
      { from: 0, to: 1, w: 8 },
      { from: 1, to: 2, w: 1 },
      { from: 2, to: 0, w: 1 },
      { from: 0, to: 3, w: 6 },
      { from: 3, to: 2, w: 2 }
    ],
    g6 = [ // for scc, sssp, apsp (negative cycle)
      { from: 0, to: 1, w: -5 },
      { from: 1, to: 2, w: 2 },
      { from: 2, to: 0, w: 1 },
      { from: 0, to: 3, w: 3 },
      { from: 3, to: 2, w: -1 }
    ],
    g7 = [ // for sssp (negative tree)
      { from: 0, to: 1, w: -5 },
      { from: 0, to: 5, w: -10 },
      { from: 1, to: 2, w: 1 },
      { from: 2, to: 3, w: 1 },
      { from: 3, to: 4, w: -10000 }
    ],
    g8 = [ // for sssp, apsp (negative graph)
      { from: 0, to: 3, w: 2 },
      { from: 1, to: 2, w: 3 },
      { from: 1, to: 0, w: 6 },
      { from: 2, to: 0, w: 4 },
      { from: 2, to: 3, w: 5 },
      { from: 3, to: 1, w: -7 },
      { from: 3, to: 2, w: -3 }
    ],
    g9 = [ // for scc
      { from: 0, to: 1, w: 1 },
      { from: 1, to: 2, w: 1 },
      { from: 2, to: 0, w: 1 },
      { from: 1, to: 3, w: 1 },
      { from: 3, to: 4, w: 1 },
      { from: 3, to: 6, w: 1 },
      { from: 4, to: 5, w: 1 },
      { from: 5, to: 6, w: 1 },
      { from: 6, to: 4, w: 1 },
      { from: 2, to: 7, w: 1 },
      { from: 2, to: 10, w: 1 },
      { from: 7, to: 6, w: 1 },
      { from: 8, to: 5, w: 1 },
      { from: 7, to: 8, w: 1 },
      { from: 8, to: 9, w: 1 },
      { from: 9, to: 10, w: 1 },
      { from: 10, to: 7, w: 1 },
      { from: 7, to: 9, w: 1 }
    ];

  return {
    g0: g0,
    g1: g1,
    g2: g2,
    g3: g3,
    g4: g4,
    g5: g5,
    g6: g6,
    g7: g7,
    g8: g8,
    g9: g9
  };
}
