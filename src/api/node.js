'use strict'
const isCyclic = require('./../fn/isCyclic')
const decomposePath = require('./../fn/decomposePath')
const patchFn = require('./patch')

/**
 * node
 *
 * Adds a dynamic node
 */
module.exports = db => {
  let patch = patchFn(db)

  return (path, deps, fn) => {
    try {

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

    } catch (e) {
      patch({
        op: 'add',
        path: '/err/node/-',
        value: e.toString()
      })

    }
  }
}
