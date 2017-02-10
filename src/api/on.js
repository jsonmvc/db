'use strict'
const getStaticNodes = require('./../fn/getStaticNodes')
const triggerListener = require('./../fn/triggerListener')
const decomposePath = require('./../fn/decomposePath')
const patch = require('./patch')
const err = require('./../fn/err')

let listenerId = 0

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

  listenerId += 1
  if (!db.updates.fns[path]) {
    db.updates.fns[path] = {}
    db.updates.fns[path][listenerId] = fn
    db.updates.cache[path] = {}

    let parts = decomposePath(path)
    let nodes = getStaticNodes(db, path)

    parts.forEach(x => {
      if (db.dynamic.fns[x]) {
        let n = getStaticNodes(db, x)
        nodes = nodes.concat(n)
      }
    })

    nodes.forEach(x => {
      if (!db.updates.triggers[x]) {
        db.updates.triggers[x] = [path]
      } else if (db.updates.triggers[x].indexOf(path) === -1) {
        db.updates.triggers[x].push(path)
      }
    })

    parts.forEach(y => {
      if (!db.updates.triggers[y]) {
        db.updates.triggers[y] = [path]
      } else if (db.updates.triggers[y].indexOf(path) === -1) {
        db.updates.triggers[y].push(path)
      }
    })

  } else {
    db.updates.fns[path][listenerId] = fn
  }

  triggerListener(db, path)

  let id = listenerId
  return function unsubscribe() {
    delete db.updates.fns[path][id]
  }
}
