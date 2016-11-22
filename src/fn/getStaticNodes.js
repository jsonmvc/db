'use strict'
const flatten = require('./flatten')

const getStaticNodes = (db, path) => {

  if (db.dynamic.fns[path]) {
    let deps = db.dynamic.deps[path]
    return flatten(deps.map(x => getStaticNodes(db, x)))
  } else {
    return [path]
  }

}

module.exports = getStaticNodes
