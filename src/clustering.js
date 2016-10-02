import Graph from './graph';
import Bitcode from './bitcode';
import UF from './unionfind';
import 'babel-polyfill';

export default {
  maxSpacing: maxSpacing,
  bitcodeK2: bitcodeK2
};

function maxSpacing(g, k) {
  var spte = Graph.mstKruskal(g),
    eindices = spte.slice(0).sort((a, b) => g.es[b].props.w - g.es[a].props.w);
  return g.es[eindices[k - 2]].props.w;
}

function bitcodeK2(bitcodeArr) {
  var n = bitcodeArr.length,
    intReps = bitcodeArr.map(x => Bitcode.toInt(x)),
    unqIdx = [],
    intSeen = new Set(),
    i;

  for (i = 0; i < n; i++) {
    if (!intSeen.has(intReps[i])) {
      intSeen.add(intReps[i]);
      unqIdx.push(i);
    }
  }

  var unqBitcodeArr = unqIdx.map(i => bitcodeArr[i]),
    unqIntReps = unqIdx.map(i => intReps[i]),
    unqN = unqIdx.length;

  var pos = new Map();
  for (i = 0; i < unqN; i++) {
    pos.set(unqIntReps[i], i);
  }

  var uf = UF.init(unqN),
    intMutated, j, iroot, jroot;
  for (i = 0; i < unqN; i++) {
    intMutated = Bitcode.toIntMutate2(unqBitcodeArr[i]);
    for (j = 0; j < intMutated.length; j++) {
      if (pos.has(intMutated[j])) {
        iroot = UF.find(uf, i);
        jroot = UF.find(uf, pos.get(intMutated[j]));
        if (iroot !== jroot) {
          UF.union(uf, iroot, jroot);
        }
      }
    }
  }

  var unqRoot = new Set();
  for (i = 0; i < unqN; i++) {
    iroot = UF.find(uf, i);
    unqRoot.add(iroot);
  }
  return unqRoot.size;
}
