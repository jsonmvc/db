'use strict'
const isCyclic = require('./../fn/isCyclic')
const decomposePath = require('./../fn/decomposePath')
const err = require('./../fn/err')
const isValidPath = require('./../fn/isValidPath')
const clearNode = require('./../fn/clearNode')
const triggerListener = require('./../fn/triggerListener')
const pathTriggers = require('./../fn/pathTriggers')
const expandNodeDeps = require('./../fn/expandNodeDeps')
const invalidateCache = require('./../fn/invalidateCache')

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

  if (fn instanceof Function === false) {
    err(db, '/err/types/node/2', node)
    return
  }

  if (deps instanceof Array === false) {
    err(db, '/err/types/node/2', node)
    return
  }

  // @TODO: Add this to warnings
  /*
  if (deps.length !== fn.length) {
    err(db, '/err/types/node/4', node)
    return
  }
  */

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
  //
  // @TODO: Add the root to the nesting so that:
  // db.get('/') also gets all the dynamic nodes in
  let xs = decomposePath(path)
  xs.push('/')
  xs.map(x => {
    if (!db.dynamic.nesting[x]) {
      db.dynamic.nesting[x] = []
    }

    if (db.dynamic.nesting[x].indexOf(path) === -1) {
      db.dynamic.nesting[x].push(path)
    }
  })


  // @TODO: Based on this nesting create a new array that
  // contains also the dependencies of the nested nodes
  // thus generating the entire list of nodes.
  // Also order them depth last
  // nestingShallow
  // nestingDeep

  node.deps.forEach(x => {

    if (!db.dynamic.reverseDeps[x]) {
      db.dynamic.reverseDeps[x] = [node.path]
    } else {
      db.dynamic.reverseDeps[x].push(node.path)
    }

    let dep = decomposePath(x)

    dep.forEach(y => {
      if (!db.dynamic.inverseDeps[y]) {
        db.dynamic.inverseDeps[y] = [node.path]
      } else {
        db.dynamic.inverseDeps[y].push(node.path)
      }
    })

  })

  expandNodeDeps(db.dynamic)

  db.cache.dynamic[node.path] = []

  invalidateCache(db, { full: [node.path] })

  pathTriggers(db, path).map(x => {
    triggerListener(db, x)
  })

  return function removeNode() {

    let triggers = pathTriggers(db, path)
    delete db.dynamic.fns[path]

    invalidateCache(db, { full: [node.path] })

    clearNode(db.dynamic.nesting, path)

    triggers.map(x => {
      triggerListener(db, x)
    })
  }
}
