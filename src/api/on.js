'use strict'
const getStaticNodes = require('./../fn/getStaticNodes')
const triggerListener = require('./../fn/triggerListener')
const decomposePath = require('./../fn/decomposePath')
const patch = require('./patch')
const err = require('./../fn/err')

/**
 * on
 *
 * Adds a listener
 *
 * - when a listener is first added a check is made
 *   on the path and if it exists then the listener
 *   is executed (async!)
 */
module.exports = db => (path, fn) => {
  let obj = {
    path: path,
    fn: fn
  }

  if (fn instanceof Function === false) {
    err(db, '/err/types/on/1', obj)
    return
  }

  if (fn.length !== 1) {
    err(db, '/err/types/on/1', obj)
    return
  }

  if (!db.updates.fns[path]) {
    db.updates.fns[path] = [fn]
    db.updates.cache[path] = {}

    let nodes = getStaticNodes(db, path)

    nodes.forEach(x => {
      if (!db.updates.triggers[x]) {
        db.updates.triggers[x] = [path]
      } else if (db.updates.triggers[x].indexOf(path) === -1) {
        db.updates.triggers[x].push(path)
      }
    })

    let parts = decomposePath(path)
    parts.forEach(y => {
      if (!db.updates.triggers[y]) {
        db.updates.triggers[y] = [path]
      } else if (db.updates.triggers[y].indexOf(path) === -1) {
        db.updates.triggers[y].push(path)
      }
    })

  } else {
    db.updates.fns[path].push(fn)
  }

  triggerListener(db, path)
}
