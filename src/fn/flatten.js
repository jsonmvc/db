'use strict'

// http://stackoverflow.com/questions/27266550/how-to-flatten-nested-array-in-javascript
module.exports = (array, mutable) => {
  let toString = Object.prototype.toString;
  let arrayTypeStr = '[object Array]';

  let result = [];
  let nodes = (mutable && array) || array.slice();
  let node;

  if (!array.length) {
    return result;
  }

  node = nodes.pop();

  do {
    if (toString.call(node) === arrayTypeStr) {
        nodes.push.apply(nodes, node);
    } else {
        result.push(node);
    }
  } while (nodes.length && (node = nodes.pop()) !== undefined);

  result.reverse();
  return result;
}
