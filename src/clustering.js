import Graph from './graph';

export default {
  maxSpacing: maxSpacing
};

function maxSpacing(g, k) {
  var spt = Graph.mstKruskal(g),
    eindices = spt.eindices.slice(0).sort((a, b) => g.es[b].props.w - g.es[a].props.w);
  return g.es[eindices[k - 2]].props.w;
}
