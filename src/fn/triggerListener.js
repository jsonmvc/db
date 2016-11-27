'use strict'

const getNode = require('./getNode')

require('setimmediate')

module.exports = (db, path) => {

  let fns = db.updates.fns[path]
  let len = fns.length

  for (let i = 0; i < len; i += 1) {

    setImmediate(() => {
      let val = getNode(db, path)
      let cacheTest = JSON.stringify(val)

      if (db.updates.cache[path] !== cacheTest) {
        db.updates.cache[path] = cacheTest
        try {
          fns[i].call(null, JSON.parse(cacheTest))
        } catch (e) {

        }
      }

    })

  }

}
