import Graph from '../src/graph';

describe('graph', () => {
  describe('minimum spanning tree (mst)', () => {
    var g1, g2, g3;

    beforeEach(() => {
      g1 = [
        { from: 0, to: 1, w: 1 },
        { from: 0, to: 2, w: 2 },
        { from: 1, to: 2, w: 3 },
        { from: 1, to: 3, w: 2 },
        { from: 2, to: 3, w: 1 }
      ];
      g2 = [
        { from: 0, to: 1, w: 2 },
        { from: 0, to: 3, w: 6 },
        { from: 1, to: 2, w: 3 },
        { from: 1, to: 3, w: 8 },
        { from: 1, to: 4, w: 5 },
        { from: 2, to: 4, w: 7 },
        { from: 3, to: 4, w: 9 }
      ];
      g3 = [
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
      ];
    });

    it('mstPrim should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromWeightedEdges(t);
        return Graph.mstPrim(g).sort((a, b) => a - b);
      }
      expect(_testOne(g1)).toEqual([0, 1, 4]);
      expect(_testOne(g2)).toEqual([0, 1, 2, 4]);
      expect(_testOne(g3)).toEqual([1, 2, 6, 8]);
    });

    it('mstKruskal should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromWeightedEdges(t);
        return Graph.mstKruskal(g).sort((a, b) => a - b);
      }
      expect(_testOne(g1)).toEqual([0, 1, 4]);
      expect(_testOne(g2)).toEqual([0, 1, 2, 4]);
      expect(_testOne(g3)).toEqual([1, 2, 6, 8]);
    });
  });

  describe('single source shortest path (sssp)', () => {
    var g1;

    beforeEach(() => {
      g1 = [
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
      ];
    });

    it('ssspDijkstra should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromWeightedEdges(t);
        return Graph.ssspDijkstra(g, 0);
      }
      expect(_testOne(g1)).toEqual([0, 1, 2, 3, 4, 4, 3, 2]);
    });
  });
});
