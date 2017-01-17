'use strict'

const getNode = require('./getNode')
const err = require('./err')

require('setimmediate')

function callNode(db, path, i) {
  let fn = db.updates.fns[path][i]

  if (!fn) {
    return
  }

  let val = getNode(db, path)
  let cacheTest = JSON.stringify(val)

  if (db.updates.cache[path][i] !== cacheTest) {
    db.updates.cache[path][i] = cacheTest

    ;(function () {
      try {
        fn.call(null, JSON.parse(cacheTest))
      } catch (e) {
        err(db, '/err/types/on/2', {
          path: path,
          error: e
        })
      }
    }())

  }
}

function triggerListener(db, path) {

  let fns = db.updates.fns[path]

  if (!fns) {
    return
  }

  let ids = Object.keys(fns)
  let len = ids.length

  for (let i = 0; i < len; i += 1) {

    setImmediate(() => {
      callNode(db, path, ids[i])
    })

  }

}

module.exports = triggerListener
