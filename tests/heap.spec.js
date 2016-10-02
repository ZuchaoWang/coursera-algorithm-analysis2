import Heap from '../src/heap';

describe('heap', () => {
  describe('push', () => {
    it('should add the first element', () => {
      var h = new Heap();
      h.push(1);
      expect(h.toObject()).toEqual({
        arr: [1],
        id2Pos: [
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
        id2Pos: [
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
        id2Pos: [
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
      h.pop();
      expect(h.toObject()).toEqual({
        arr: [1, 3, 2],
        id2Pos: [
          [1, 0],
          [3, 1],
          [2, 2]
        ]
      });
    });

    it('should remove the last element', () => {
      var h = new Heap(undefined, undefined, [1], new Map([
        [1, 0]
      ]));
      h.pop();
      expect(h.toObject()).toEqual({
        arr: [],
        id2Pos: []
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

  describe('remove', () => {
    it('should remove element', () => {
      var h = new Heap(undefined, undefined, [1, 3, 2], new Map([
        [1, 0],
        [3, 1],
        [2, 2]
      ]));
      h.remove(3);
      expect(h.toObject()).toEqual({
        arr: [1, 2],
        id2Pos: [
          [1, 0],
          [2, 1]
        ]
      });
    });

    it('should remove element by id', () => {
      var h = new Heap(undefined, undefined, [1, 3, 2], new Map([
        [1, 0],
        [3, 1],
        [2, 2]
      ]));
      h.remove(3, true);
      expect(h.toObject()).toEqual({
        arr: [1, 2],
        id2Pos: [
          [1, 0],
          [2, 1]
        ]
      });
    });

    it('should remove the last element by id', () => {
      var h = new Heap(undefined, undefined, [1], new Map([
        [1, 0]
      ]));
      h.remove(1, true);
      expect(h.toObject()).toEqual({
        arr: [],
        id2Pos: []
      });
    });

    it('should remove element, with custom idFunc', () => {
      var h = new Heap(undefined, a => a * a, [1, 3, 2], new Map([
        [1, 0],
        [9, 1],
        [4, 2]
      ]));
      h.remove(3);
      expect(h.toObject()).toEqual({
        arr: [1, 2],
        id2Pos: [
          [1, 0],
          [4, 1]
        ]
      });
    });

    it('should remove element by id, with custom idFunc', () => {
      var h = new Heap(undefined, a => a * a, [1, 3, 2], new Map([
        [1, 0],
        [9, 1],
        [4, 2]
      ]));
      h.remove(9, true);
      expect(h.toObject()).toEqual({
        arr: [1, 2],
        id2Pos: [
          [1, 0],
          [4, 1]
        ]
      });
    });
  });
});
