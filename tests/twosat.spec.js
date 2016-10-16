import TwoSAT from '../src/twosat';

describe('twosat', () => {
  describe('testing satisfiability', () => {
    var t1 = [
        [1, 2],
        [-1, 2],
        [3, 4],
        [-3, 4],
        [-2, -4]
      ],
      t2 = [
        [1, 2],
        [-1, 2],
        [1, -2],
        [-1, -2],
        [4, 5],
        [6, 7],
        [7, 8],
        [1, -8]
      ],
      t3 = [
        [1, 3],
        [1, -4],
        [2, -4],
        [2, -5],
        [3, -5],
        [1, -6],
        [2, -6],
        [3, -6],
        [4, 7],
        [5, 7],
        [6, 7]
      ],
      t4 = [
        [1, 2],
        [2, 3],
        [3, 4],
        [1, 4],
        [4, 5],
        [6, 7],
        [7, 8],
        [1, -8]
      ];

    it('should be correct', () => {
      function _testOne(t) {
        return TwoSAT.isSatisfiable(t);
      }
      expect(_testOne(t1)).toBe(false);
      expect(_testOne(t2)).toBe(false);
      expect(_testOne(t3)).toBe(true);
      expect(_testOne(t4)).toBe(true);
    });
  });
});
