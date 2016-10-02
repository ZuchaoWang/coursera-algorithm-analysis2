import 'babel-polyfill';

var dftCmpFunc = (a, b) => a - b,
  dftIdFunc = a => a;

export default class Heap {
  constructor(cmpFunc = dftCmpFunc, idFunc = dftIdFunc, arr = [], id2Pos = new Map()) {
    // input of arr and id2Pos are used merely for testing
    this._cmpFunc = cmpFunc;
    this._idFunc = idFunc;
    this._arr = arr;
    this._id2Pos = id2Pos;
  }

  clear() {
    this._arr = [];
    this._id2Pos = new Map();
  }

  toObject() {
    return {
      arr: this._arr,
      id2Pos: Array.from(this._id2Pos.entries()).sort((a, b) => a[1] - b[1])
    };
  }

  push(x) {
    var arr = this._arr,
      id2Pos = this._id2Pos;

    var xid = this._idFunc(x);
    if (id2Pos.has(xid)) {
      throw new Error(`heap push: id ${xid} already existed`);
    } else {
      id2Pos.set(xid, arr.length);
      arr.push(x);
      this.siftUp();
    }
  }

  pop() {
    var arr = this._arr,
      id2Pos = this._id2Pos,
      idFunc = this._idFunc,
      n = arr.length;
    if (n === 0) {
      throw new Error(`heap pop: nothing to pop`);
    }

    var val = arr[0];
    id2Pos.delete(idFunc(val));
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

  remove(x_or_xid, isId = false) {
    var arr = this._arr,
      id2Pos = this._id2Pos,
      idFunc = this._idFunc,
      xid = isId ? x_or_xid : idFunc(x_or_xid);

    if (!id2Pos.has(xid)) {
      throw new Error(`heap remove: id ${xid} does not exist`);
    } else {
      var cur = id2Pos.get(xid),
        last = arr.length - 1;
      id2Pos.set(idFunc(arr[last]), cur);
      id2Pos.delete(xid);
      arr[cur] = arr[last];
      arr.pop();
      this.siftUp(cur);
      this.siftDown(cur);
    }
  }

  size() {
    return this._arr.length;
  }

  siftUp(start = -1) {
    var arr = this._arr,
      id2Pos = this._id2Pos,
      idFunc = this._idFunc,
      cmpFunc = this._cmpFunc,
      cur = (start !== -1) ? start : arr.length - 1,
      parent;

    while (cur > 0) {
      parent = Math.floor((cur - 1) / 2);
      if (cmpFunc(arr[cur], arr[parent]) < 0) {
        id2Pos.set(idFunc(arr[parent]), cur);
        id2Pos.set(idFunc(arr[cur]), parent);
        [arr[parent], arr[cur]] = [arr[cur], arr[parent]];
        cur = parent;
      } else {
        break;
      }
    }
  }

  siftDown(start = 0) {
    var arr = this._arr,
      id2Pos = this._id2Pos,
      idFunc = this._idFunc,
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
        id2Pos.set(idFunc(arr[sel]), cur);
        id2Pos.set(idFunc(arr[cur]), sel);
        [arr[sel], arr[cur]] = [arr[cur], arr[sel]];
        cur = sel;
      } else {
        break;
      }
    }
  }
}
