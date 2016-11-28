'use strict'
const isCyclic = require('./../fn/isCyclic')
const decomposePath = require('./../fn/decomposePath')
const err = require('./../fn/err')
const isValidPath = require('./../fn/isValidPath')

/**
 * node
 *
 * Adds a dynamic node
 */
module.exports = db => (path, deps, fn) => {

  let node = {
    path: path,
    deps: deps,
    fn: fn
  }

  if (db.dynamic.deps[path]) {
    err(db, '/err/types/node/1', node)
    return
  }

  if (fn instanceof Function === false) {
    err(db, '/err/types/node/2', node)
    return
  }

  if (deps instanceof Array === false) {
    err(db, '/err/types/node/2', node)
    return
  }

  if (deps.length !== fn.length) {
    err(db, '/err/types/node/4', node)
    return
  }

  let paths = deps.concat(path)
  let validPaths = paths.filter(isValidPath)

  if (validPaths.length !== paths.length) {
    err(db, '/err/types/node/2', node)
    return
  }

  db.dynamic.deps[path] = deps

  if (isCyclic(db.dynamic.deps)) {
    delete db.dynamic.deps[path]
    err(db, '/err/types/node/3', node)
    return
  }

  db.dynamic.fns[path] = fn

  // @TODO: When adding in dynamic nesting always reorder
  // based on the nesting depth - deepest last so that
  // when iterating for computation the deepest nodes
  // should be already computed when reaching the top
  // ones.
  let xs = decomposePath(path)
  xs.map(x => {
    if (!db.dynamic.nesting[x]) {
      db.dynamic.nesting[x] = []
    }
    db.dynamic.nesting[x].push(path)
  })

  // @TODO: Based on this nesting create a new array that
  // contains also the dependencies of the nested nodes
  // thus generating the entire list of nodes.
  // Also order them depth last
  // nestingShallow
  // nestingDeep

}
