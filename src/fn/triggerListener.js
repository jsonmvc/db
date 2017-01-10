'use strict'

const getNode = require('./getNode')
const err = require('./err')

require('setimmediate')

function callNode(db, path, i) {
  let fns = db.updates.fns[path]
  let val = getNode(db, path)
  let cacheTest = JSON.stringify(val)

  if (db.updates.cache[path][i] !== cacheTest) {
    db.updates.cache[path][i] = cacheTest

    ;(function () {
      try {
        fns[i].call(null, JSON.parse(cacheTest))
      } catch (e) {
        err(db, '/err/types/on/2', {
          path: path,
          error: e
        })
      }
    }())

  }
}

let isDebug = require('./isDebug')
let debugWrapper = require('./debugWrapper')

if (isDebug) {
  callNode = debugWrapper('triggerListner', callNode, 1)
}

function triggerListener(db, path) {

  let fns = db.updates.fns[path]

  if (!fns) {
    return
  }

  let len = fns.length

  for (let i = 0; i < len; i += 1) {

    setImmediate(() => {
      callNode(db, path, i)
    })

  }

}

module.exports = triggerListener
