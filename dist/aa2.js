(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("babel-polyfill"));
	else if(typeof define === 'function' && define.amd)
		define(["babel-polyfill"], factory);
	else if(typeof exports === 'object')
		exports["aa2"] = factory(require("babel-polyfill"));
	else
		root["aa2"] = factory(root["babel-polyfill"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__) {
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
	
	var _wcomptime = __webpack_require__(6);
	
	var _wcomptime2 = _interopRequireDefault(_wcomptime);
	
	var _graph = __webpack_require__(1);
	
	var _graph2 = _interopRequireDefault(_graph);
	
	var _clustering = __webpack_require__(5);
	
	var _clustering2 = _interopRequireDefault(_clustering);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  wcomptime: _wcomptime2.default,
	  graph: _graph2.default,
	  clustering: _clustering2.default
	};
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();
	
	__webpack_require__(3);
	
	var _unionfind = __webpack_require__(2);
	
	var _unionfind2 = _interopRequireDefault(_unionfind);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  makeGraphFromWeightedEdges: makeGraphFromWeightedEdges,
	  mstPrim: mstPrim,
	  mstKruskal: mstKruskal,
	  sumOfEdgeWeight: sumOfEdgeWeight
	};
	
	
	function makeGraphFromWeightedEdges(wedges) {
	  var nn = 0,
	      i;
	  for (i = 0; i < wedges.length; i++) {
	    nn = Math.max(nn, wedges[i].from + 1);
	    nn = Math.max(nn, wedges[i].to + 1);
	  }
	
	  var ns = new Array(nn);
	  for (i = 0; i < nn; i++) {
	    ns[i] = { idx: i, nbs: [] };
	  }
	
	  var es = new Array(wedges.length);
	  for (i = 0; i < wedges.length; i++) {
	    es[i] = {
	      idx: i,
	      from: wedges[i].from,
	      to: wedges[i].to,
	      props: {
	        w: wedges[i].w
	      }
	    };
	    ns[wedges[i].from].nbs.push({
	      nidx: wedges[i].to,
	      eidx: i
	    });
	    ns[wedges[i].to].nbs.push({
	      nidx: wedges[i].from,
	      eidx: i
	    });
	  }
	
	  return {
	    ns: ns,
	    es: es
	  };
	}
	
	function mstPrim(g) {
	  if (g.ns.length === 0) {
	    return {
	      nindices: [],
	      eindices: []
	    };
	  }
	
	  var nvisited = new Set(),
	      evisited = [],
	      nfrontier = new Map(),
	      // key: nidx, value: eidx (with least weight)
	  firstNode = true;
	
	  while (firstNode || nfrontier.size > 0) {
	    var minNidx;
	    if (firstNode) {
	      // choose first
	      firstNode = false;
	      minNidx = 0;
	
	      // record visited
	      nvisited.add(minNidx);
	    } else {
	      // choose min
	      var minEidx = null;
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = nfrontier[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var _step$value = _slicedToArray(_step.value, 2);
	
	          var nidx = _step$value[0];
	          var eidx = _step$value[1];
	
	          if (minEidx == null || g.es[eidx].props.w < g.es[minEidx].props.w) {
	            minNidx = nidx;
	            minEidx = eidx;
	          }
	        }
	
	        // record visited
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
	
	      nvisited.add(minNidx);
	      evisited.push(minEidx);
	
	      // update nfrontier
	      nfrontier.delete(minNidx);
	    }
	
	    // for all neighbours
	    for (var i = 0; i < g.ns[minNidx].nbs.length; i++) {
	      var nb = g.ns[minNidx].nbs[i],
	          nextNidx = nb.nidx,
	          nextEidx = nb.eidx;
	
	      // restrict to unvisited neighbours
	      if (!nvisited.has(nextNidx)) {
	        if (nfrontier.has(nextNidx)) {
	          var prevEidx = nfrontier.get(nextNidx);
	          if (g.es[nextEidx].props.w < g.es[prevEidx].props.w) {
	            nfrontier.set(nextNidx, nextEidx);
	          }
	        } else {
	          // previously unreachable
	          nfrontier.set(nextNidx, nextEidx);
	        }
	      }
	    }
	  }
	
	  return {
	    nindices: Array.from(nvisited),
	    eindices: evisited
	  };
	}
	
	function mstKruskal(g) {
	  var nn = g.ns.length,
	      uf = _unionfind2.default.init(nn),
	      eSorted = g.es.slice(0).sort(function (a, b) {
	    return a.props.w - b.props.w;
	  }),
	      i;
	
	  var nindices = [];
	  for (i = 0; i < nn; i++) {
	    nindices.push(i);
	  }
	
	  var eindices = [];
	  for (i = 0; i < eSorted.length; i++) {
	    var e = eSorted[i],
	        fromRoot = _unionfind2.default.find(uf, e.from),
	        toRoot = _unionfind2.default.find(uf, e.to);
	    if (fromRoot !== toRoot) {
	      _unionfind2.default.union(uf, e.from, e.to);
	      eindices.push(e.idx);
	    }
	  }
	
	  return {
	    nindices: nindices,
	    eindices: eindices
	  };
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
/* 2 */
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
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  toInt: toInt,
	  toIntMutate2: toIntMutate2
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
	
	function _mutate(intRep, bitAtP, p, n) {
	  if (bitAtP) {
	    return intRep - (1 << n - p - 1);
	  } else {
	    return intRep + (1 << n - p - 1);
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
	
	var _graph = __webpack_require__(1);
	
	var _graph2 = _interopRequireDefault(_graph);
	
	var _bitcode = __webpack_require__(4);
	
	var _bitcode2 = _interopRequireDefault(_bitcode);
	
	var _unionfind = __webpack_require__(2);
	
	var _unionfind2 = _interopRequireDefault(_unionfind);
	
	__webpack_require__(3);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  maxSpacing: maxSpacing,
	  bitcodeK2: bitcodeK2
	};
	
	
	function maxSpacing(g, k) {
	  var spt = _graph2.default.mstKruskal(g),
	      eindices = spt.eindices.slice(0).sort(function (a, b) {
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