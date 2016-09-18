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
	
	var _wcomptime = __webpack_require__(2);
	
	var _wcomptime2 = _interopRequireDefault(_wcomptime);
	
	var _graph = __webpack_require__(1);
	
	var _graph2 = _interopRequireDefault(_graph);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	exports.default = {
	  wcomptime: _wcomptime2.default,
	  graph: _graph2.default
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
	
	exports.default = {
	  makeGraphFromWeightedEdges: makeGraphFromWeightedEdges,
	  mstPrim: mstPrim,
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

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=aa2.js.map