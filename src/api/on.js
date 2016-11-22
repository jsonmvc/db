'use strict'
const getStaticNodes = require('./../fn/getStaticNodes')
const triggerListener = require('./../fn/triggerListener')

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

  if (!db.updates.fns[path]) {
    db.updates.fns[path] = []
  }

  db.updates.fns[path].push(fn)

  let nodes = getStaticNodes(db, path)

  nodes.forEach(x => {
    if (!db.updates.triggers[x]) {
      db.updates.triggers[x] = []
    }
    db.updates.triggers[x].push(path)
  })

  triggerListener(db, path)

}
