import Knapsack from '../src/knapsack';

describe('knapsack', () => {
  describe('knapsack', () => {
    var k1 = {
        totalWeight: 5,
        vals: [4, 2, 6, 7],
        weights: [1, 1, 2, 3]
      },
      k2 = {
        totalWeight: 40,
        vals: [7, 2, 7, 9, 5, 4, 2, 6, 1, 7],
        weights: [5, 5, 7, 3, 9, 1, 8, 8, 9, 7]
      };

    it('should be correct', () => {
      function _testOne(t) {
        return Knapsack.knapsack(t.totalWeight, t.vals, t.weights);
      }
      expect(_testOne(k1)).toBe(13);
      expect(_testOne(k2)).toBe(45);
    });
  });
});
