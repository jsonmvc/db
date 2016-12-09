'use strict'

const getNode = require('./getNode')
const err = require('./err')

require('setimmediate')

module.exports = (db, path) => {

  let fns = db.updates.fns[path]

  if (!fns) {
    return
  }

  let len = fns.length

  for (let i = 0; i < len; i += 1) {

    setImmediate(() => {
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

    })

  }

}
