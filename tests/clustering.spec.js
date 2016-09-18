import Graph from '../src/graph';
import Clustering from '../src/clustering';

describe('clustering', () => {
  describe('max spacing', () => {
    var g1 = [
        { from: 0, to: 1, w: 100 },
        { from: 0, to: 2, w: 50 },
        { from: 2, to: 3, w: 7 },
        { from: 3, to: 5, w: 2 },
        { from: 4, to: 5, w: 1 },
        { from: 3, to: 4, w: 3 }
      ],
      g2 = [
        { from: 0, to: 1, w: 1 },
        { from: 0, to: 2, w: 2 },
        { from: 0, to: 3, w: 3 },
        { from: 0, to: 4, w: 4 },
        { from: 1, to: 2, w: 5 },
        { from: 1, to: 3, w: 6 },
        { from: 1, to: 4, w: 7 },
        { from: 2, to: 3, w: 8 },
        { from: 2, to: 4, w: 9 },
        { from: 3, to: 4, w: 10 }
      ];

    it('should be correct', () => {
      function _testOne(t, k) {
        var g = Graph.makeGraphFromWeightedEdges(t);
        return Clustering.maxSpacing(g, k);
      }
      expect(_testOne(g1, 4)).toBe(7);
      expect(_testOne(g2, 4)).toBe(2);
    });
  });
});
