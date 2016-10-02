import 'babel-polyfill';

var dftCmpFunc = (a, b) => a - b,
  dftKeyFunc = a => a;

export default class Heap {
  constructor(cmpFunc = dftCmpFunc, keyFunc = dftKeyFunc, arr = [], pos = new Map()) {
    // input of arr and pos are used merely for testing
    this._cmpFunc = cmpFunc;
    this._keyFunc = keyFunc;
    this._arr = arr;
    this._pos = pos;
  }

  clear() {
    this._arr = [];
    this._pos = new Map();
  }

  toObject() {
    return {
      arr: this._arr,
      pos: Array.from(this._pos.entries()).sort((a, b) => a[1] - b[1])
    };
  }

  push(x) {
    var arr = this._arr,
      pos = this._pos;

    var xkey = this._keyFunc(x);
    if (pos.has(xkey)) {
      throw new Error(`heap push: key ${xkey} already existed`);
    } else {
      pos.set(xkey, arr.length);
      arr.push(x);
      this.siftUp();
    }
  }

  pop() {
    var arr = this._arr,
      pos = this._pos,
      keyFunc = this._keyFunc,
      n = arr.length;
    if (n === 0) {
      throw new Error(`heap pop: nothing to pop`);
    }

    var val = arr[0];
    pos.delete(keyFunc(val));
    if (n === 1) {
      arr.pop();
    } else {
      arr[0] = arr.pop();
      this.siftDown();
    }
    return val;
  }

  peek() {
    var arr = this._arr;
    if (arr.length === 0) {
      throw new Error(`heap peek: nothing to peek`);
    }

    return arr[0];
  }

  popKey(xkey) {
    var arr = this._arr,
      pos = this._pos,
      keyFunc = this._keyFunc;

    if (!pos.has(xkey)) {
      throw new Error(`heap popKey: key ${xkey} does not exist`);
    } else {
      var cur = pos.get(xkey),
        last = arr.length - 1,
        val = arr[cur];
      pos.set(keyFunc(arr[last]), cur);
      pos.delete(xkey);
      arr[cur] = arr[last];
      arr.pop();
      this.siftUp(cur);
      this.siftDown(cur);
      return val;
    }
  }

  hasKey(xkey) {
    return this._pos.has(xkey);
  }

  getKey(xkey) {
    var pos = this._pos;
    if (!pos.has(xkey)) {
      throw new Error(`heap getKey: key ${xkey} does not exist`);
    } else {
      return pos.get(xkey);
    }
  }

  size() {
    return this._arr.length;
  }

  siftUp(start = -1) {
    var arr = this._arr,
      pos = this._pos,
      keyFunc = this._keyFunc,
      cmpFunc = this._cmpFunc,
      cur = (start !== -1) ? start : arr.length - 1,
      parent;

    while (cur > 0) {
      parent = Math.floor((cur - 1) / 2);
      if (cmpFunc(arr[cur], arr[parent]) < 0) {
        pos.set(keyFunc(arr[parent]), cur);
        pos.set(keyFunc(arr[cur]), parent);
        [arr[parent], arr[cur]] = [arr[cur], arr[parent]];
        cur = parent;
      } else {
        break;
      }
    }
  }

  siftDown(start = 0) {
    var arr = this._arr,
      pos = this._pos,
      keyFunc = this._keyFunc,
      n = this._arr.length,
      cur = start,
      cmpFunc = this._cmpFunc,
      left, right, sel;

    for (;;) {
      sel = cur;
      left = cur * 2 + 1;
      right = cur * 2 + 2;
      if (left < n && cmpFunc(arr[left], arr[sel]) < 0) {
        sel = left;
      }
      if (right < n && cmpFunc(arr[right], arr[sel]) < 0) {
        sel = right;
      }
      if (sel !== cur) {
        pos.set(keyFunc(arr[sel]), cur);
        pos.set(keyFunc(arr[cur]), sel);
        [arr[sel], arr[cur]] = [arr[cur], arr[sel]];
        cur = sel;
      } else {
        break;
      }
    }
  }
}
