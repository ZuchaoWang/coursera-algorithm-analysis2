export default {
  sortByDiff: sortByDiff,
  sortByRatio: sortByRatio,
  getWCompTime: getWCompTime
};

function sortByDiff(tasks) {
  return tasks.sort((a, b) => {
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
  return tasks.sort((a, b) => {
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
