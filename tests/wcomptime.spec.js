import WCompTime from '../src/wcomptime';

describe('wcomptime', () => {
  var tasks1, tasks2, tasks3;

  beforeEach(() => {
    tasks1 = [
      { w: 8, l: 50 },
      { w: 74, l: 59 },
      { w: 31, l: 73 },
      { w: 45, l: 79 },
      { w: 10, l: 10 },
      { w: 41, l: 66 }
    ];
    tasks2 = [
      { w: 8, l: 50 },
      { w: 74, l: 59 },
      { w: 31, l: 73 },
      { w: 45, l: 79 },
      { w: 24, l: 10 },
      { w: 41, l: 66 },
      { w: 93, l: 43 },
      { w: 88, l: 4 },
      { w: 28, l: 30 },
      { w: 41, l: 13 }
    ];
    tasks3 = [
      { w: 1, l: 37 },
      { w: 79, l: 39 },
      { w: 94, l: 16 },
      { w: 16, l: 73 },
      { w: 48, l: 44 },
      { w: 52, l: 40 },
      { w: 96, l: 27 },
      { w: 15, l: 86 },
      { w: 20, l: 81 },
      { w: 99, l: 57 },
      { w: 10, l: 90 },
      { w: 46, l: 66 },
      { w: 77, l: 52 },
      { w: 42, l: 74 },
      { w: 16, l: 45 },
      { w: 47, l: 4 },
      { w: 84, l: 41 },
      { w: 34, l: 54 },
      { w: 87, l: 53 },
      { w: 13, l: 69 },
      { w: 83, l: 88 },
      { w: 69, l: 63 },
      { w: 5, l: 97 },
      { w: 13, l: 65 },
      { w: 10, l: 46 },
      { w: 17, l: 10 },
      { w: 62, l: 79 },
      { w: 62, l: 32 },
      { w: 13, l: 12 },
      { w: 57, l: 61 },
      { w: 100, l: 98 },
      { w: 43, l: 7 }
    ];
  });

  it('should handle diff case', () => {
    function _testOne(t) {
      return WCompTime.getWCompTime(WCompTime.sortByDiff(t));
    }
    expect(_testOne(tasks1)).toBe(31814);
    expect(_testOne(tasks2)).toBe(61545);
    expect(_testOne(tasks3)).toBe(688647);
  });

  it('should handle ratio case', () => {
    function _testOne(t) {
      return WCompTime.getWCompTime(WCompTime.sortByRatio(t));
    }
    expect(_testOne(tasks1)).toBe(31814);
    expect(_testOne(tasks2)).toBe(60213);
    expect(_testOne(tasks3)).toBe(674634);
  });
});
