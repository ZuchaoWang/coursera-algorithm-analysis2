import TSP from '../src/tsp';

describe('tsp', () => {
  describe('max spacing', () => {
    var p1 = [
        [1, 1],
        [2, 3],
        [3, 1]
      ],
      p2 = [
        [1, 1],
        [2, 3],
        [3, 1],
        [4, 2]
      ];

    it('should be correct', () => {
      function _testOne(p) {
        var disMatrix = TSP.geoDisMatrix(p),
          minTSPDis = TSP.tsp(disMatrix, p.length);
        return Math.floor(minTSPDis);
      }
      expect(_testOne(p1)).toBe(6);
      expect(_testOne(p2)).toBe(7);
    });
  });
});
