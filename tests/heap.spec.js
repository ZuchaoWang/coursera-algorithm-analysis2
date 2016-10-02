import Heap from '../src/heap';

describe('heap', () => {
  describe('push', () => {
    it('should add the first element', () => {
      var h = new Heap();
      h.push(1);
      expect(h.toObject()).toEqual({
        arr: [1],
        pos: [
          [1, 0]
        ]
      });
    });

    it('should leave largest element at bottom', () => {
      var h = new Heap(undefined, undefined, [1, 3, 2], new Map([
        [1, 0],
        [3, 1],
        [2, 2]
      ]));
      h.push(4);
      expect(h.toObject()).toEqual({
        arr: [1, 3, 2, 4],
        pos: [
          [1, 0],
          [3, 1],
          [2, 2],
          [4, 3]
        ]
      });
    });

    it('should make smallest element to the top', () => {
      var h = new Heap(undefined, undefined, [1, 3, 2], new Map([
        [1, 0],
        [3, 1],
        [2, 2]
      ]));
      h.push(0);
      expect(h.toObject()).toEqual({
        arr: [0, 1, 2, 3],
        pos: [
          [0, 0],
          [1, 1],
          [2, 2],
          [3, 3]
        ]
      });
    });
  });

  describe('pop', () => {
    it('should remove the top element', () => {
      var h = new Heap(undefined, undefined, [0, 1, 2, 3], new Map([
        [0, 0],
        [1, 1],
        [2, 2],
        [3, 3]
      ]));
      expect(h.pop()).toEqual(0);
      expect(h.toObject()).toEqual({
        arr: [1, 3, 2],
        pos: [
          [1, 0],
          [3, 1],
          [2, 2]
        ]
      });
    });

    it('should remove the second last element', () => {
      var h = new Heap(undefined, undefined, [0, 1], new Map([
        [0, 0],
        [1, 1]
      ]));
      expect(h.pop()).toEqual(0);
      expect(h.toObject()).toEqual({
        arr: [1],
        pos: [
          [1, 0]
        ]
      });
    });

    it('should remove the last element', () => {
      var h = new Heap(undefined, undefined, [1], new Map([
        [1, 0]
      ]));
      expect(h.pop()).toEqual(1);
      expect(h.toObject()).toEqual({
        arr: [],
        pos: []
      });
    });
  });

  describe('push and pop', () => {
    it('should correctly sort an array', () => {
      var h = new Heap(),
        result = [],
        n = 100,
        i;
      for (i = 0; i < n; i++) {
        h.push(Math.random());
      }
      for (i = 0; i < n; i++) {
        result.push(h.pop());
      }
      expect(result.slice(0)).toEqual(result.slice(0).sort((a, b) => a - b));
    });

    it('should correctly sort an array, with custom cmp function', () => {
      var h = new Heap((a, b) => b - a),
        result = [],
        n = 100,
        i;
      for (i = 0; i < n; i++) {
        h.push(Math.random());
      }
      for (i = 0; i < n; i++) {
        result.push(h.pop());
      }
      expect(result.slice(0)).toEqual(result.slice(0).sort((a, b) => b - a));
    });
  });

  describe('peek', () => {
    it('should return the first element', () => {
      var h = new Heap(undefined, undefined, [1, 3, 2], new Map([
        [1, 0],
        [3, 1],
        [2, 2]
      ]));
      expect(h.peek()).toEqual(1);
    });
  });

  describe('popKey', () => {
    it('should remove element', () => {
      var h = new Heap(undefined, undefined, [1, 3, 2], new Map([
        [1, 0],
        [3, 1],
        [2, 2]
      ]));
      expect(h.popKey(3)).toEqual(3);
      expect(h.toObject()).toEqual({
        arr: [1, 2],
        pos: [
          [1, 0],
          [2, 1]
        ]
      });
    });

    it('should remove element, with custom keyFunc', () => {
      var h = new Heap((a, b) => a.w - b.w, a => a.k, [{ k: 1, w: 1 }, { k: 3, w: 9 }, { k: 2, w: 4 }], new Map(
        [
          [1, 0],
          [3, 1],
          [2, 2]
        ]));
      expect(h.popKey(3)).toEqual({ k: 3, w: 9 });
      expect(h.toObject()).toEqual({
        arr: [{ k: 1, w: 1 }, { k: 2, w: 4 }],
        pos: [
          [1, 0],
          [2, 1]
        ]
      });
    });

    it('should remove the last element, with custom keyFunc', () => {
      var h = new Heap((a, b) => a.w - b.w, a => a.k, [{ k: 1, w: 1 }], new Map([
        [1, 0]
      ]));
      expect(h.popKey(1)).toEqual({ k: 1, w: 1 });
      expect(h.toObject()).toEqual({
        arr: [],
        pos: []
      });
    });

    it('should remove the tail element, with custom keyFunc', () => {
      var h = new Heap((a, b) => a.w - b.w, a => a.k, [{ k: 1, w: 1 }, { k: 2, w: 4 }], new Map([
        [1, 0],
        [2, 1]
      ]));
      expect(h.popKey(2)).toEqual({ k: 2, w: 4 });
      expect(h.toObject()).toEqual({
        arr: [{ k: 1, w: 1 }],
        pos: [
          [1, 0]
        ]
      });
    });
  });

  describe('getKey', () => {
    it('should return element', () => {
      var h = new Heap((a, b) => a.w - b.w, a => a.k, [{ k: 1, w: 1 }], new Map([
        [1, 0]
      ]));
      expect(h.getKey(1)).toEqual({ k: 1, w: 1 });
      expect(h.toObject()).toEqual({
        arr: [{ k: 1, w: 1 }],
        pos: [
          [1, 0]
        ]
      });
    });
  });
});
