'use strict'
const isCyclic = require('./../fn/isCyclic')
const decomposePath = require('./../fn/decomposePath')

/**
 * node
 *
 * Adds a dynamic node
 */
module.exports = db => (path, deps, fn) => {

  if (db.dynamic.deps[path]) {
    throw new Error(`Node already exists at ${path}`)
  }

  let tempDeps = Object.assign({}, db.dynamic.deps)
  tempDeps[path] = deps

  if (isCyclic(tempDeps)) {
    throw new Error(`Dynamic nodes are cyclic`)
  }

  db.dynamic.deps[path] = deps
  db.dynamic.fns[path] = fn

  let xs = decomposePath(path)
  xs.map(x => {
    if (!db.dynamic.nesting[x]) {
      db.dynamic.nesting[x] = []
    }
    db.dynamic.nesting[x].push(path)
  })

}
