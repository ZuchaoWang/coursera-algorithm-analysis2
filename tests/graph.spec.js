import Graph from '../src/graph';

describe('graph', () => {
  describe('mstPrim weight sum', () => {
    var g1 = [
        { from: 0, to: 1, w: 1 },
        { from: 0, to: 2, w: 2 },
        { from: 1, to: 2, w: 3 },
        { from: 1, to: 3, w: 2 },
        { from: 2, to: 3, w: 1 }
      ],
      g2 = [
        { from: 0, to: 1, w: 2 },
        { from: 0, to: 3, w: 6 },
        { from: 1, to: 2, w: 3 },
        { from: 1, to: 3, w: 8 },
        { from: 1, to: 4, w: 5 },
        { from: 2, to: 4, w: 7 },
        { from: 3, to: 4, w: 9 }
      ],
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

    it('should be correct', () => {
      function _testOne(t) {
        var g = Graph.makeGraphFromWeightedEdges(t),
          spt = Graph.mstPrim(g);
        return Graph.sumOfEdgeWeight(g, spt.eindices);
      }
      expect(_testOne(g1)).toBe(4);
      expect(_testOne(g2)).toBe(16);
      expect(_testOne(g3)).toBe(-236);
    });
  });
});
