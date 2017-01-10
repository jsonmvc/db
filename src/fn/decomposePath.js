'use strict'

function decomposePath(path) {
  let xs = []

  let x = path.slice(0, path.lastIndexOf('/'))
  while(x !== '') {
    xs.push(x)
    x = x.slice(0, x.lastIndexOf('/'))
  }
  return xs
}

let isDebug = require('./isDebug')
let debugWrapper = require('./debugWrapper')

if (isDebug) {
  decomposePath = debugWrapper('decomposePath', decomposePath, 0)
}

module.exports = decomposePath

