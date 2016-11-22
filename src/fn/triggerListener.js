'use strict'

const getNode = require('./getNode')
const asyncCall = require('./asyncCall')

module.exports = (db, path) => {

  let fns = db.updates.fns[path]
  let len = fns.length

  for (let i = 0; i < len; i += 1) {

    asyncCall(() => {
      let val = getNode(db, path)
      let cacheTest = JSON.stringify(val)

      if (db.updates.cache[path] !== cacheTest) {
        db.updates.cache[path] = cacheTest
        fns[i].call(null, val)
      }

    })

  }

}
