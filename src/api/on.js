'use strict'
const getStaticNodes = require('./../fn/getStaticNodes')
const triggerListener = require('./../fn/triggerListener')
const decomposePath = require('./../fn/decomposePath')

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
  try {

    if (!db.updates.fns[path]) {
      db.updates.fns[path] = []
    }

    db.updates.fns[path].push(fn)

    let nodes = getStaticNodes(db, path)

    nodes.forEach(x => {
      if (!db.updates.triggers[x]) {
        db.updates.triggers[x] = []
      }

      if (db.updates.triggers[x].indexOf(path) === -1) {
        db.updates.triggers[x].push(path)
      }

      let parts = decomposePath(path)
      parts.forEach(y => {
        if (!db.updates.triggers[y]) {
          db.updates.triggers[y] = []
        }
        if (db.updates.triggers[y].indexOf(path) === -1) {
          db.updates.triggers[y].push(path)
        }
      })

    })

    triggerListener(db, path)

  } catch (e) {
    db.patch({
      op: 'add',
      path: '/err/on',
      value: e.toString()
    })
  }

}
