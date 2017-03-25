'use strict'
const splitPath = require('./splitPath')
const decomposePath = require('./decomposePath')

// @TODO: Add precomputation in expandNodeDeps to calculate all the static nodes
// upon which the dynamic nodes depens
// @TODO: Change set cache to add dynamic nodes differently:
// e.g. if a dynamic node is /foo and the path /foo/bar is requested
// then the cache will be store:
// /foo: {
//    /foo/bar: 123
// }
//
// Implementation:
// if (cache[path]) {
//    return cache[path]
// } else if (cache[rootOfDynamicNode(path)]) {
//    return cache[rootOfDynamicNode(path)][path]
// } else {
//    -> compute value
// }
//
// Doing so when deleting a dynamic node no iteration on children node
// is needed. Just a clear delete on the node ref.
//
// To optimize this further create a single ref spaning from the static node that
// all the dynamic nodes are listening to and delete only that.
//
// Implementing the same for listeners!

function invalidateCache(db, changed) {

  changed.full.forEach(x => {

    let paths = decomposePath(x)
    paths.push(x)

    let affectedDynamic = paths.reduce((acc, y) => {
      if (db.dynamic.staticDeps[y]) {
        acc = acc.concat(db.dynamic.staticDeps[y])
      }
      return acc
    }, [])

    affectedDynamic.forEach(y => {
      if (db.cache.dynamic[y]) {
        db.cache.dynamic[y].forEach(t => {
          delete db.cache.paths[t]
        })
        db.cache.dynamic[y] = []
      }
    })

    paths.forEach(y => {
      delete db.cache.paths[y]
    })

  })

  delete db.cache.paths['/']

}

module.exports = invalidateCache
