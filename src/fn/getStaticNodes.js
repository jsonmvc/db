'use strict'
const flatten = require('lodash/flattenDeep')

let getStaticNodes = (db, path) => {

  if (db.dynamic.fns[path]) {
    let deps = db.dynamic.deps[path]
    return flatten(deps.map(x => getStaticNodes(db, x)))
  } else {
    return [path]
  }

}

let isDebug = require('./isDebug')
let debugWrapper = require('./debugWrapper')

if (isDebug) {
  getStaticNodes = debugWrapper('getStaticNodes', getStaticNodes, 1)
}

module.exports = getStaticNodes
