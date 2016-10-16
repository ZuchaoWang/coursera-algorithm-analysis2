(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("babel-polyfill"));
	else if(typeof define === 'function' && define.amd)
		define(["babel-polyfill"], factory);
	else if(typeof exports === 'object')
		exports["aa2"] = factory(require("babel-polyfill"));
	else
		root["aa2"] = factory(root["babel-polyfill"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _wcomptime = __webpack_require__(10);
	
	var _wcomptime2 = _interopRequireDefault(_wcomptime);
	
	var _graph = __webpack_require__(2);
	
	var _graph2 = _interopRequireDefault(_graph);
	
	var _clustering = __webpack_require__(5);
	
	var _clustering2 = _interopRequireDefault(_clustering);
	
	var _knapsack = __webpack_require__(7);
	
	var _knapsack2 = _interopRequireDefault(_knapsack);
	
	var _tsp = __webpack_require__(8);
	
	var _tsp2 = _interopRequireDefault(_tsp);
	
	var _twosat = __webpack_require__(9);
	
	var _twosat2 = _interopRequireDefault(_twosat);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  wcomptime: _wcomptime2.default,
	  graph: _graph2.default,
	  clustering: _clustering2.default,
	  knapsack: _knapsack2.default,
	  tsp: _tsp2.default,
	  twosat: _twosat2.default
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	__webpack_require__(1);
	
	var _unionfind = __webpack_require__(4);
	
	var _unionfind2 = _interopRequireDefault(_unionfind);
	
	var _heap = __webpack_require__(6);
	
	var _heap2 = _interopRequireDefault(_heap);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  makeGraphFromEdges: makeGraphFromEdges,
	  addDummySourceNode: addDummySourceNode,
	  clone: clone,
	  reverse: reverse,
	  dfs: dfs,
	  sccKosaraju: sccKosaraju,
	  mstPrim: mstPrim,
	  mstKruskal: mstKruskal,
	  ssspDijkstra: ssspDijkstra,
	  ssspBellmanFord: ssspBellmanFord,
	  apspJohnson: apspJohnson,
	  sumOfEdgeWeight: sumOfEdgeWeight
	};
	
	
	function makeGraphFromEdges(wedges) {
	  var directed = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	  var weighted = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	  var nn = 0,
	      i;
	  for (i = 0; i < wedges.length; i++) {
	    nn = Math.max(nn, wedges[i].from + 1);
	    nn = Math.max(nn, wedges[i].to + 1);
	  }
	
	  var ns = new Array(nn);
	  for (i = 0; i < nn; i++) {
	    if (directed) {
	      ns[i] = { idx: i, innbs: [], outnbs: [] };
	    } else {
	      ns[i] = { idx: i, nbs: [] };
	    }
	  }
	
	  var es = new Array(wedges.length);
	  for (i = 0; i < wedges.length; i++) {
	    es[i] = {
	      idx: i,
	      from: wedges[i].from,
	      to: wedges[i].to,
	      props: weighted ? { w: wedges[i].w } : { w: 1 }
	    };
	    if (directed) {
	      ns[wedges[i].from].outnbs.push({
	        nidx: wedges[i].to,
	        eidx: i
	      });
	      ns[wedges[i].to].innbs.push({
	        nidx: wedges[i].from,
	        eidx: i
	      });
	    } else {
	      ns[wedges[i].from].nbs.push({
	        nidx: wedges[i].to,
	        eidx: i
	      });
	      ns[wedges[i].to].nbs.push({
	        nidx: wedges[i].from,
	        eidx: i
	      });
	    }
	  }
	
	  return {
	    directed: directed,
	    ns: ns,
	    es: es
	  };
	}
	
	function addDummySourceNode(g, props) {
	  var nn = g.ns.length,
	      en = g.es.length,
	      i;
	
	  if (g.directed) {
	    g.ns.push({
	      idx: nn,
	      innbs: [],
	      outnbs: []
	    });
	    for (i = 0; i < nn; i++) {
	      g.ns[nn].outnbs.push({
	        nidx: i,
	        eidx: en + i
	      });
	      g.ns[i].innbs.push({
	        nidx: nn,
	        eidx: en + i
	      });
	      g.es.push({
	        idx: en + i,
	        from: nn,
	        to: i,
	        props: Object.assign({}, props)
	      });
	    }
	  } else {
	    g.ns.push({
	      idx: nn,
	      nbs: []
	    });
	    for (i = 0; i < nn; i++) {
	      g.ns[nn].nbs.push({
	        nidx: i,
	        eidx: en + i
	      });
	      g.ns[i].nbs.push({
	        nidx: nn,
	        eidx: en + i
	      });
	      g.es.push({
	        idx: en + i,
	        from: nn,
	        to: i,
	        props: Object.assign({}, props)
	      });
	    }
	  }
	
	  return g;
	}
	
	function clone(g) {
	  var nn = g.ns.length,
	      en = g.es.length,
	      ns = new Array(nn),
	      es = new Array(en),
	      i,
	      j;
	
	  if (g.directed) {
	    for (i = 0; i < nn; i++) {
	      ns[i] = { idx: i, innbs: [], outnbs: [] };
	      for (j = 0; j < g.ns[i].outnbs.length; j++) {
	        ns[i].outnbs.push({
	          nidx: g.ns[i].outnbs[j].nidx,
	          eidx: g.ns[i].outnbs[j].eidx
	        });
	      }
	      for (j = 0; j < g.ns[i].innbs.length; j++) {
	        ns[i].innbs.push({
	          nidx: g.ns[i].innbs[j].nidx,
	          eidx: g.ns[i].innbs[j].eidx
	        });
	      }
	    }
	  } else {
	    for (i = 0; i < nn; i++) {
	      ns[i] = { idx: i, nbs: [] };
	      for (j = 0; j < g.ns[i].nbs.length; j++) {
	        ns[i].nbs.push({
	          nidx: g.ns[i].nbs[j].nidx,
	          eidx: g.ns[i].nbs[j].eidx
	        });
	      }
	    }
	  }
	
	  for (i = 0; i < en; i++) {
	    es[i] = {
	      idx: i,
	      from: g.es[i].from,
	      to: g.es[i].to,
	      props: Object.assign({}, g.es[i].props) // props will be shallow copy
	    };
	  }
	
	  return {
	    directed: g.directed,
	    ns: ns,
	    es: es
	  };
	}
	
	function reverse(g) {
	  if (!g.directed) {
	    return g;
	  }
	
	  var nn = g.ns.length,
	      en = g.es.length,
	      i;
	
	  for (i = 0; i < nn; i++) {
	    var _ref = [g.ns[i].outnbs, g.ns[i].innbs];
	    g.ns[i].innbs = _ref[0];
	    g.ns[i].outnbs = _ref[1];
	  }
	
	  for (i = 0; i < en; i++) {
	    var _ref2 = [g.es[i].to, g.es[i].from];
	    g.es[i].from = _ref2[0];
	    g.es[i].to = _ref2[1];
	  }
	
	  return g;
	}
	
	function dfs(g, nOrder, cbLeader, cbPre, cbPost) {
	  var nn = g.ns.length,
	      anynbs = g.directed ? 'outnbs' : 'nbs',
	      stack = [],
	      visited = new Array(nn),
	      i;
	  visited.fill(false);
	
	  if (!nOrder) {
	    nOrder = new Array(nn);
	    for (i = 0; i < nn; i++) {
	      nOrder[i] = i;
	    }
	  }
	
	  for (i = 0; i < nOrder.length; i++) {
	    var cur = nOrder[i];
	    if (!visited[cur]) {
	      visited[cur] = true;
	      if (cbLeader) {
	        cbLeader(cur);
	      }
	      if (cbPre) {
	        cbPre(cur);
	      }
	      stack.push({ cur: cur, nbChecked: 0 });
	      while (stack.length) {
	        var pc = stack.pop(),
	            nnb = g.ns[pc.cur][anynbs].length,
	            j = pc.nbChecked;
	        while (j < nnb) {
	          var next = g.ns[pc.cur][anynbs][j].nidx;
	          if (!visited[next]) {
	            stack.push({ cur: pc.cur, nbChecked: j + 1 });
	            visited[next] = true;
	            if (cbPre) {
	              cbPre(next);
	            }
	            stack.push({ cur: next, nbChecked: 0 });
	            break;
	          }
	          j++;
	        }
	        if (j === nnb) {
	          if (cbPost) {
	            cbPost(pc.cur);
	          }
	        }
	      }
	    }
	  }
	}
	
	function sccKosaraju(g) {
	  var nn = g.ns.length,
	      order = [],
	      gRev = reverse(g);
	
	  dfs(gRev, null, null, null, function (i) {
	    order.push(i);
	  });
	  order = order.reverse();
	
	  var gOri = reverse(gRev),
	      labels = new Array(nn),
	      compCount = 0;
	  dfs(gOri, order, function (i) {
	    compCount++;
	  }, function (i) {
	    labels[i] = compCount - 1;
	  }, null);
	
	  return labels;
	}
	
	function mstPrim(g) {
	  if (g.ns.length === 0) {
	    return [];
	  }
	
	  // nodes are in nadded, or nfrontier (reachable but not added), or neither (currently not reachable)
	  var nadded = new Set(),
	      eadded = [],
	      nfrontier = new _heap2.default(function (a, b) {
	    return a.w - b.w;
	  }, function (a) {
	    return a.nidx;
	  }),
	      // nidx, eidx, w
	  firstNode = true;
	
	  while (firstNode || nfrontier.size() > 0) {
	    var minNidx;
	    if (firstNode) {
	      // choose first
	      firstNode = false;
	      minNidx = 0;
	
	      // record visited
	      nadded.add(minNidx);
	    } else {
	      // choose min
	      var minElem = nfrontier.pop(),
	          minEidx = minElem.eidx;
	      minNidx = minElem.nidx;
	
	      // record visited
	      nadded.add(minNidx);
	      eadded.push(minEidx);
	    }
	
	    // for all neighbours
	    for (var i = 0; i < g.ns[minNidx].nbs.length; i++) {
	      var nb = g.ns[minNidx].nbs[i],
	          nextNidx = nb.nidx,
	          nextEidx = nb.eidx;
	
	      // restrict to neighbours that are not added
	      if (!nadded.has(nextNidx)) {
	        if (nfrontier.hasKey(nextNidx)) {
	          var prevElem = nfrontier.getKey(nextNidx);
	          if (g.es[nextEidx].props.w < prevElem.w) {
	            nfrontier.popKey(nextNidx);
	            nfrontier.push({ nidx: nextNidx, eidx: nextEidx, w: g.es[nextEidx].props.w });
	          }
	        } else {
	          // previously unreachable
	          nfrontier.push({ nidx: nextNidx, eidx: nextEidx, w: g.es[nextEidx].props.w });
	        }
	      }
	    }
	  }
	
	  return eadded;
	}
	
	function mstKruskal(g) {
	  var nn = g.ns.length,
	      uf = _unionfind2.default.init(nn),
	      eSorted = g.es.slice(0).sort(function (a, b) {
	    return a.props.w - b.props.w;
	  });
	
	  var eadded = [];
	  for (var i = 0; i < eSorted.length; i++) {
	    var e = eSorted[i],
	        fromRoot = _unionfind2.default.find(uf, e.from),
	        toRoot = _unionfind2.default.find(uf, e.to);
	    if (fromRoot !== toRoot) {
	      _unionfind2.default.union(uf, e.from, e.to);
	      eadded.push(e.idx);
	    }
	  }
	
	  return eadded;
	}
	
	function ssspDijkstra(g, s) {
	  var nn = g.ns.length,
	      disArray = new Array(nn),
	      nfrontier = new _heap2.default(function (a, b) {
	    return a.w - b.w;
	  }, function (a) {
	    return a.nidx;
	  }),
	      // nidx, eidx, w
	  firstNode = true,
	      i;
	
	  for (i = 0; i < nn; i++) {
	    disArray[i] = null;
	  }
	
	  while (firstNode || nfrontier.size() > 0) {
	    var minNidx;
	    if (firstNode) {
	      // start from s
	      firstNode = false;
	      minNidx = s;
	      disArray[minNidx] = 0;
	    } else {
	      // choose min
	      var minElem = nfrontier.pop();
	      minNidx = minElem.nidx;
	      disArray[minNidx] = minElem.w;
	    }
	
	    // for all neighbours
	    for (i = 0; i < g.ns[minNidx].outnbs.length; i++) {
	      var outnb = g.ns[minNidx].outnbs[i],
	          nextNidx = outnb.nidx,
	          nextEidx = outnb.eidx;
	
	      if (disArray[nextNidx] == null) {
	        // not done
	        if (nfrontier.hasKey(nextNidx)) {
	          var prevElem = nfrontier.getKey(nextNidx);
	          if (disArray[minNidx] + g.es[nextEidx].props.w < prevElem.w) {
	            nfrontier.popKey(nextNidx);
	            nfrontier.push({ nidx: nextNidx, w: disArray[minNidx] + g.es[nextEidx].props.w });
	          }
	        } else {
	          nfrontier.push({ nidx: nextNidx, w: disArray[minNidx] + g.es[nextEidx].props.w });
	        }
	      }
	    }
	  }
	
	  return disArray;
	}
	
	function ssspBellmanFord(g, s) {
	  var debug = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	  var nn = g.ns.length,
	      prevDisArray = [],
	      disArray = new Array(nn),
	      i;
	
	  for (i = 0; i < nn; i++) {
	    disArray[i] = null;
	  }
	  disArray[s] = 0;
	
	  // n iterations
	  for (var k = 0; k < nn; k++) {
	    prevDisArray = disArray.slice(0);
	    // for all nodes
	    for (var curNidx = 0; curNidx < nn; curNidx++) {
	      if (prevDisArray[curNidx] != null) {
	        // for all neighbours
	        for (var j = 0; j < g.ns[curNidx].outnbs.length; j++) {
	          var outnb = g.ns[curNidx].outnbs[j],
	              nextNidx = outnb.nidx,
	              nextEidx = outnb.eidx;
	          if (disArray[nextNidx] == null || prevDisArray[curNidx] + g.es[nextEidx].props.w < disArray[nextNidx]) {
	            disArray[nextNidx] = prevDisArray[curNidx] + g.es[nextEidx].props.w;
	          }
	        }
	      }
	    }
	    if (debug && Math.floor((k + 1) * 100 / nn) > Math.floor(k * 100 / nn)) {
	      console.log('ssspBellmanFord: completed ' + (k + 1) + '/' + nn + ' rounds');
	    }
	  }
	
	  for (i = 0; i < nn; i++) {
	    if (prevDisArray[i] !== disArray[i]) {
	      return null; // negative cycle detected
	    }
	  }
	
	  return disArray;
	}
	
	function apspJohnson(g) {
	  var minDisOnly = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];
	  var debug = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	  if (debug) {
	    console.log('apspJohnson: adding dummy nodes ...');
	  }
	
	  // add dummy nodes
	  var gDummy = addDummySourceNode(clone(g), { w: 0 });
	
	  if (debug) {
	    console.log('apspJohnson: calculating node weight ...');
	  }
	
	  // calculate node weight
	  var nn = g.ns.length,
	      nodeWeights = ssspBellmanFord(gDummy, nn, debug);
	  if (nodeWeights == null) {
	    return null; // negative cycle detected
	  }
	
	  if (debug) {
	    console.log('apspJohnson: re-weighting each edge ...');
	  }
	
	  // re-weight each edge and make it non-negative
	  var gRW = clone(g),
	      i;
	  for (i = 0; i < gRW.es.length; i++) {
	    var edge = gRW.es[i];
	    edge.props.w = edge.props.w + nodeWeights[edge.from] - nodeWeights[edge.to];
	  }
	
	  if (debug) {
	    console.log('apspJohnson: runing dijkstra for each source ...');
	  }
	
	  // run dijkstra for each source and restore path length
	  var disMatrix = new Array(nn),
	      minDis = null,
	      j;
	  for (i = 0; i < nn; i++) {
	    var disArray = ssspDijkstra(gRW, i);
	    for (j = 0; j < nn; j++) {
	      if (disArray[j] != null) {
	        disArray[j] = disArray[j] - nodeWeights[i] + nodeWeights[j];
	        if (minDis == null || minDis > disArray[j]) {
	          minDis = disArray[j];
	        }
	      }
	    }
	    if (!minDisOnly) {
	      disMatrix[i] = disArray;
	    }
	    if (debug && Math.floor((i + 1) * 100 / nn) > Math.floor(i * 100 / nn)) {
	      console.log('apspJohnson: completed ' + (i + 1) + '/' + nn + ' sources');
	    }
	  }
	
	  return minDisOnly ? minDis : disMatrix;
	}
	
	function sumOfEdgeWeight(g, eidices) {
	  var sum = 0;
	  for (var i = 0; i < eidices.length; i++) {
	    sum += g.es[eidices[i]].props.w;
	  }
	  return sum;
	}
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	__webpack_require__(1);
	
	exports.default = {
	  toInt: toInt,
	  toIntMutate2: toIntMutate2,
	  intCount: intCount,
	  intDec1: intDec1,
	  genAllInts: genAllInts
	};
	
	
	function toInt(bits) {
	  var n = bits.length,
	      sum = 0;
	  for (var i = 0; i < n; i++) {
	    sum |= bits[i] << n - i - 1;
	  }
	  return sum;
	}
	
	function toIntMutate2(bits) {
	  var sum = toInt(bits),
	      n = bits.length,
	      mutated = [],
	      tmp;
	
	  for (var i = 0; i < n; i++) {
	    tmp = _mutate(sum, bits[i], i, n);
	    mutated.push(tmp);
	    for (var j = i + 1; j < n; j++) {
	      mutated.push(_mutate(tmp, bits[j], j, n));
	    }
	  }
	  return mutated;
	}
	
	function intCount(sum, n) {
	  var count = 0;
	  for (var i = 0; i < n; i++) {
	    if (sum & 1 << n - i - 1) {
	      count++;
	    }
	  }
	  return count;
	}
	
	function intDec1(sum, n) {
	  var dec = [];
	  for (var i = 0; i < n; i++) {
	    if (sum & 1 << n - i - 1) {
	      dec.push({ p: i, s: sum - (1 << n - i - 1) });
	    }
	  }
	  return dec;
	}
	
	function genAllInts(n) {
	  var N = Math.pow(2, n),
	      allInts = new Array(n + 1),
	      i;
	  for (i = 0; i < n + 1; i++) {
	    allInts[i] = [];
	  }
	  for (i = 0; i < N; i++) {
	    allInts[intCount(i, n)].push(i);
	  }
	  return allInts;
	}
	
	function _mutate(intRep, bitAtP, p, n) {
	  if (bitAtP) {
	    return intRep - (1 << n - p - 1);
	  } else {
	    return intRep + (1 << n - p - 1);
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  init: init,
	  union: union,
	  find: find
	};
	
	
	function init(n) {
	  var parentArr = new Array(n),
	      rankArr = new Array(n);
	  for (var i = 0; i < n; i++) {
	    parentArr[i] = i;
	    rankArr[i] = 0;
	  }
	  return {
	    parent: parentArr,
	    rank: rankArr
	  };
	}
	
	function find(uf, i) {
	  if (uf.parent[i] !== i) {
	    uf.parent[i] = find(uf, uf.parent[i]);
	  }
	  return uf.parent[i];
	}
	
	function union(uf, i, j) {
	  var iroot = find(uf, i),
	      jroot = find(uf, j);
	
	  if (uf.rank[iroot] < uf.rank[jroot]) {
	    uf.parent[iroot] = jroot;
	  } else if (uf.rank[iroot] > uf.rank[jroot]) {
	    uf.parent[jroot] = iroot;
	  } else {
	    uf.parent[jroot] = iroot;
	    uf.rank[iroot]++;
	  }
	}
	module.exports = exports["default"];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _graph = __webpack_require__(2);
	
	var _graph2 = _interopRequireDefault(_graph);
	
	var _bitcode = __webpack_require__(3);
	
	var _bitcode2 = _interopRequireDefault(_bitcode);
	
	var _unionfind = __webpack_require__(4);
	
	var _unionfind2 = _interopRequireDefault(_unionfind);
	
	__webpack_require__(1);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  maxSpacing: maxSpacing,
	  bitcodeK2: bitcodeK2
	};
	
	
	function maxSpacing(g, k) {
	  var spte = _graph2.default.mstKruskal(g),
	      eindices = spte.slice(0).sort(function (a, b) {
	    return g.es[b].props.w - g.es[a].props.w;
	  });
	  return g.es[eindices[k - 2]].props.w;
	}
	
	function bitcodeK2(bitcodeArr) {
	  var n = bitcodeArr.length,
	      intReps = bitcodeArr.map(function (x) {
	    return _bitcode2.default.toInt(x);
	  }),
	      unqIdx = [],
	      intSeen = new Set(),
	      i;
	
	  for (i = 0; i < n; i++) {
	    if (!intSeen.has(intReps[i])) {
	      intSeen.add(intReps[i]);
	      unqIdx.push(i);
	    }
	  }
	
	  var unqBitcodeArr = unqIdx.map(function (i) {
	    return bitcodeArr[i];
	  }),
	      unqIntReps = unqIdx.map(function (i) {
	    return intReps[i];
	  }),
	      unqN = unqIdx.length;
	
	  var pos = new Map();
	  for (i = 0; i < unqN; i++) {
	    pos.set(unqIntReps[i], i);
	  }
	
	  var uf = _unionfind2.default.init(unqN),
	      intMutated,
	      j,
	      iroot,
	      jroot;
	  for (i = 0; i < unqN; i++) {
	    intMutated = _bitcode2.default.toIntMutate2(unqBitcodeArr[i]);
	    for (j = 0; j < intMutated.length; j++) {
	      if (pos.has(intMutated[j])) {
	        iroot = _unionfind2.default.find(uf, i);
	        jroot = _unionfind2.default.find(uf, pos.get(intMutated[j]));
	        if (iroot !== jroot) {
	          _unionfind2.default.union(uf, iroot, jroot);
	        }
	      }
	    }
	  }
	
	  var unqRoot = new Set();
	  for (i = 0; i < unqN; i++) {
	    iroot = _unionfind2.default.find(uf, i);
	    unqRoot.add(iroot);
	  }
	  return unqRoot.size;
	}
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	__webpack_require__(1);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var dftCmpFunc = function dftCmpFunc(a, b) {
	  return a - b;
	},
	    dftKeyFunc = function dftKeyFunc(a) {
	  return a;
	};
	
	var Heap = function () {
	  function Heap() {
	    var cmpFunc = arguments.length <= 0 || arguments[0] === undefined ? dftCmpFunc : arguments[0];
	    var keyFunc = arguments.length <= 1 || arguments[1] === undefined ? dftKeyFunc : arguments[1];
	    var arr = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	    var pos = arguments.length <= 3 || arguments[3] === undefined ? new Map() : arguments[3];
	
	    _classCallCheck(this, Heap);
	
	    // input of arr and pos are used merely for testing
	    this._cmpFunc = cmpFunc;
	    this._keyFunc = keyFunc;
	    this._arr = arr;
	    this._pos = pos;
	  }
	
	  _createClass(Heap, [{
	    key: 'clear',
	    value: function clear() {
	      this._arr = [];
	      this._pos = new Map();
	    }
	  }, {
	    key: 'toObject',
	    value: function toObject() {
	      return {
	        arr: this._arr,
	        pos: Array.from(this._pos.entries()).sort(function (a, b) {
	          return a[1] - b[1];
	        })
	      };
	    }
	  }, {
	    key: 'push',
	    value: function push(x) {
	      var arr = this._arr,
	          pos = this._pos;
	
	      var xkey = this._keyFunc(x);
	      if (pos.has(xkey)) {
	        throw new Error('heap push: key ' + xkey + ' already existed');
	      } else {
	        pos.set(xkey, arr.length);
	        arr.push(x);
	        this.siftUp();
	      }
	    }
	  }, {
	    key: 'pop',
	    value: function pop() {
	      var arr = this._arr,
	          pos = this._pos,
	          keyFunc = this._keyFunc,
	          n = arr.length;
	      if (n === 0) {
	        throw new Error('heap pop: nothing to pop');
	      }
	
	      var val = arr[0];
	      pos.delete(keyFunc(val));
	      if (n === 1) {
	        arr.pop();
	      } else {
	        arr[0] = arr.pop();
	        pos.set(keyFunc(arr[0]), 0);
	        this.siftDown();
	      }
	      return val;
	    }
	  }, {
	    key: 'peek',
	    value: function peek() {
	      var arr = this._arr;
	      if (arr.length === 0) {
	        throw new Error('heap peek: nothing to peek');
	      }
	
	      return arr[0];
	    }
	  }, {
	    key: 'popKey',
	    value: function popKey(xkey) {
	      var arr = this._arr,
	          pos = this._pos,
	          keyFunc = this._keyFunc;
	
	      if (!pos.has(xkey)) {
	        throw new Error('heap popKey: key ' + xkey + ' does not exist');
	      } else {
	        var cur = pos.get(xkey),
	            last = arr.length - 1,
	            val = arr[cur];
	        pos.delete(xkey);
	        if (cur === last) {
	          arr.pop();
	        } else {
	          pos.set(keyFunc(arr[last]), cur);
	          arr[cur] = arr[last];
	          arr.pop();
	          this.siftUp(cur);
	          this.siftDown(cur);
	        }
	        return val;
	      }
	    }
	  }, {
	    key: 'hasKey',
	    value: function hasKey(xkey) {
	      return this._pos.has(xkey);
	    }
	  }, {
	    key: 'getKey',
	    value: function getKey(xkey) {
	      var arr = this._arr,
	          pos = this._pos;
	      if (!pos.has(xkey)) {
	        throw new Error('heap getKey: key ' + xkey + ' does not exist');
	      } else {
	        return arr[pos.get(xkey)];
	      }
	    }
	  }, {
	    key: 'size',
	    value: function size() {
	      return this._arr.length;
	    }
	  }, {
	    key: 'siftUp',
	    value: function siftUp() {
	      var start = arguments.length <= 0 || arguments[0] === undefined ? -1 : arguments[0];
	
	      var arr = this._arr,
	          pos = this._pos,
	          keyFunc = this._keyFunc,
	          cmpFunc = this._cmpFunc,
	          cur = start !== -1 ? start : arr.length - 1,
	          parent;
	
	      while (cur > 0) {
	        parent = Math.floor((cur - 1) / 2);
	        if (cmpFunc(arr[cur], arr[parent]) < 0) {
	          pos.set(keyFunc(arr[parent]), cur);
	          pos.set(keyFunc(arr[cur]), parent);
	          var _ref = [arr[cur], arr[parent]];
	          arr[parent] = _ref[0];
	          arr[cur] = _ref[1];
	
	          cur = parent;
	        } else {
	          break;
	        }
	      }
	    }
	  }, {
	    key: 'siftDown',
	    value: function siftDown() {
	      var start = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
	
	      var arr = this._arr,
	          pos = this._pos,
	          keyFunc = this._keyFunc,
	          n = this._arr.length,
	          cur = start,
	          cmpFunc = this._cmpFunc,
	          left,
	          right,
	          sel;
	
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
	          var _ref2 = [arr[cur], arr[sel]];
	          arr[sel] = _ref2[0];
	          arr[cur] = _ref2[1];
	
	          cur = sel;
	        } else {
	          break;
	        }
	      }
	    }
	  }]);
	
	  return Heap;
	}();
	
	exports.default = Heap;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	__webpack_require__(1);
	
	exports.default = {
	  knapsack: knapsack
	};
	
	
	function knapsack(totalWeight, vals, weights) {
	  var stack = [{ n: vals.length, w: totalWeight, exclude: null, include: null }],
	      cache = new Map();
	
	  while (stack.length) {
	    var prob = stack.pop();
	    if (prob.n === 0 || prob.w === 0) {
	      cacheSet(cache, prob.n, prob.w, 0);
	    } else if (prob.exclude == null) {
	      if (cacheHas(cache, prob.n - 1, prob.w)) {
	        prob.exclude = cacheGet(cache, prob.n - 1, prob.w);
	        stack.push(prob);
	      } else {
	        stack.push(prob);
	        stack.push({ n: prob.n - 1, w: prob.w, exclude: null, include: null });
	      }
	    } else if (prob.include == null) {
	      if (prob.w < weights[prob.n - 1]) {
	        prob.include = 0;
	        stack.push(prob);
	      } else if (cacheHas(cache, prob.n - 1, prob.w - weights[prob.n - 1])) {
	        prob.include = cacheGet(cache, prob.n - 1, prob.w - weights[prob.n - 1]) + vals[prob.n - 1];
	        stack.push(prob);
	      } else {
	        stack.push(prob);
	        stack.push({ n: prob.n - 1, w: prob.w - weights[prob.n - 1], exclude: null, include: null });
	      }
	    } else {
	      cacheSet(cache, prob.n, prob.w, Math.max(prob.include, prob.exclude));
	    }
	  }
	
	  return cacheGet(cache, vals.length, totalWeight);
	}
	
	function cacheHas(cache, i, w) {
	  return cache.has(i) && cache.get(i).has(w);
	}
	
	function cacheSet(cache, i, w, v) {
	  if (!cache.has(i)) {
	    cache.set(i, new Map());
	  }
	  if (!cache.get(i).has(w)) {
	    cache.get(i).set(w, v);
	  }
	}
	
	function cacheGet(cache, i, w) {
	  return cache.get(i).get(w);
	}
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _bitcode = __webpack_require__(3);
	
	var _bitcode2 = _interopRequireDefault(_bitcode);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  geoDisMatrix: geoDisMatrix,
	  tsp: tsp
	};
	
	
	function geoDisMatrix(pos) {
	  var n = pos.length,
	      disMatrix = new Array(n);
	  for (var i = 0; i < n; i++) {
	    disMatrix[i] = new Array(n);
	    for (var j = 0; j < n; j++) {
	      var dx = pos[i][0] - pos[j][0],
	          dy = pos[i][1] - pos[j][1];
	      disMatrix[i][j] = Math.sqrt(dx * dx + dy * dy);
	    }
	  }
	  return disMatrix;
	}
	
	function tsp(disMatrix, n) {
	  var debug = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
	
	  if (n <= 1) {
	    return 0;
	  }
	
	  if (debug) {
	    console.log('generating all combinations ...');
	  }
	
	  var N = Math.pow(2, n - 1),
	      allInts = _bitcode2.default.genAllInts(n - 1);
	
	  var Nsub = 0,
	      i;
	  for (i = 0; i < allInts.length; i++) {
	    Nsub = Math.max(Nsub, allInts[i].length);
	  }
	
	  var prevMapping = new Uint32Array(N),
	      curMapping = new Uint32Array(N),
	      prevPath = new Float32Array(Nsub * n),
	      curPath = new Float32Array(Nsub * n),
	      prevCount = 0,
	      curCount = 0;
	
	  if (debug) {
	    console.log('running on 1 edge ...');
	  }
	
	  var j, dec;
	  curCount = n - 1;
	  for (j = 0; j < n - 1; j++) {
	    curMapping[allInts[1][j]] = j;
	  }
	  curPath.fill(-1, 0, (n - 1) * n);
	  for (j = 0; j < n - 1; j++) {
	    dec = _bitcode2.default.intDec1(allInts[1][j], n - 1);
	    curPath[j * n + dec[0].p] = disMatrix[n - 1][dec[0].p];
	  }
	
	  var prevDis, minDis, k, l;
	  for (i = 2; i < n; i++) {
	    if (debug) {
	      console.log('running on ' + i + ' edges ...');
	    }
	
	    var _ref = [curCount, prevCount];
	    prevCount = _ref[0];
	    curCount = _ref[1];
	    var _ref2 = [curMapping, prevMapping];
	    prevMapping = _ref2[0];
	    curMapping = _ref2[1];
	    var _ref3 = [curPath, prevPath];
	    prevPath = _ref3[0];
	    curPath = _ref3[1];
	
	    curCount = allInts[i].length;
	    for (j = 0; j < curCount; j++) {
	      curMapping[allInts[i][j]] = j;
	    }
	    curPath.fill(-1, 0, curCount * n);
	    for (j = 0; j < curCount; j++) {
	      dec = _bitcode2.default.intDec1(allInts[i][j], n - 1);
	      for (k = 0; k < dec.length; k++) {
	        // prefix-set: dec[k].s, prefix-last: l, cur-last: dec[k].p
	        minDis = -1;
	        for (l = 0; l < n; l++) {
	          prevDis = prevPath[prevMapping[dec[k].s] * n + l];
	          if (prevDis !== -1) {
	            prevDis += disMatrix[l][dec[k].p];
	            if (minDis === -1 || minDis > prevDis) {
	              minDis = prevDis;
	            }
	          }
	        }
	        curPath[j * n + dec[k].p] = minDis;
	      }
	    }
	  }
	
	  if (debug) {
	    console.log('running on ' + i + ' edges ...');
	  }
	
	  minDis = -1;
	  var curDis;
	  for (i = 0; i < n - 1; i++) {
	    curDis = curPath[i];
	    if (curDis !== -1) {
	      curDis += disMatrix[i][n - 1];
	      if (minDis === -1 || minDis > curDis) {
	        minDis = curDis;
	      }
	    }
	  }
	  return minDis;
	}
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	var _graph = __webpack_require__(2);
	
	var _graph2 = _interopRequireDefault(_graph);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  isSatisfiable: isSatisfiable
	};
	
	
	function isSatisfiable(twoSatArray) {
	  var g = twoSatArray2Graph(twoSatArray),
	      nn = g.ns.length / 2,
	      labels = _graph2.default.sccKosaraju(g);
	  for (var i = 0; i < nn; i++) {
	    if (labels[i] === labels[i + nn]) {
	      return false;
	    }
	  }
	  return true;
	}
	
	function twoSatArray2Graph(twoSatArray) {
	  var vn = 0;
	  var _iteratorNormalCompletion = true;
	  var _didIteratorError = false;
	  var _iteratorError = undefined;
	
	  try {
	    for (var _iterator = twoSatArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	      var _step$value = _slicedToArray(_step.value, 2);
	
	      var vidx1 = _step$value[0];
	      var vidx2 = _step$value[1];
	
	      vn = Math.max(vn, Math.abs(vidx1));
	      vn = Math.max(vn, Math.abs(vidx2));
	    }
	  } catch (err) {
	    _didIteratorError = true;
	    _iteratorError = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion && _iterator.return) {
	        _iterator.return();
	      }
	    } finally {
	      if (_didIteratorError) {
	        throw _iteratorError;
	      }
	    }
	  }
	
	  var edges = [];
	  var _iteratorNormalCompletion2 = true;
	  var _didIteratorError2 = false;
	  var _iteratorError2 = undefined;
	
	  try {
	    for (var _iterator2 = twoSatArray[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	      var _step2$value = _slicedToArray(_step2.value, 2);
	
	      var vidx1 = _step2$value[0];
	      var vidx2 = _step2$value[1];
	
	      edges.push({ from: vidx2nidx(-vidx1, vn), to: vidx2nidx(vidx2, vn) });
	      edges.push({ from: vidx2nidx(-vidx2, vn), to: vidx2nidx(vidx1, vn) });
	    }
	  } catch (err) {
	    _didIteratorError2 = true;
	    _iteratorError2 = err;
	  } finally {
	    try {
	      if (!_iteratorNormalCompletion2 && _iterator2.return) {
	        _iterator2.return();
	      }
	    } finally {
	      if (_didIteratorError2) {
	        throw _iteratorError2;
	      }
	    }
	  }
	
	  return _graph2.default.makeGraphFromEdges(edges, true, false);
	}
	
	function vidx2nidx(vidx, vn) {
	  if (vidx > 0) {
	    return vidx - 1;
	  } else {
	    return -vidx - 1 + vn;
	  }
	}
	module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  sortByDiff: sortByDiff,
	  sortByRatio: sortByRatio,
	  getWCompTime: getWCompTime
	};
	
	
	function sortByDiff(tasks) {
	  return tasks.sort(function (a, b) {
	    var adiff = a.w - a.l,
	        bdiff = b.w - b.l;
	    if (adiff !== bdiff) {
	      return bdiff - adiff;
	    } else {
	      return b.w - a.w;
	    }
	  });
	}
	
	function sortByRatio(tasks) {
	  return tasks.sort(function (a, b) {
	    return b.w / b.l - a.w / a.l;
	  });
	}
	
	function getWCompTime(tasks) {
	  var sum = 0,
	      cumt = 0;
	  for (var i = 0; i < tasks.length; i++) {
	    cumt += tasks[i].l;
	    sum += tasks[i].w * cumt;
	  }
	  return sum;
	}
	module.exports = exports["default"];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=aa2.js.map