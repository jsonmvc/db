'use strict'

const getNode = require('./getNode')
const patch = require('./../api/patch')

require('setimmediate')

module.exports = (db, path) => {

  let fns = db.updates.fns[path]
  let len = fns.length

  for (let i = 0; i < len; i += 1) {

    console.log('settings immeadig')
    setImmediate(() => {
      let val = getNode(db, path)
      let cacheTest = JSON.stringify(val)

      if (db.updates.cache[path] !== cacheTest) {
        db.updates.cache[path] = cacheTest
        try {
          fns[i].call(null, JSON.parse(cacheTest))
        } catch (e) {
          console.log(e)
          patch(db)({
            op: 'add',
            path: '/err/patch/-',
            value: e.toString()
          })
        }
      }

    })

  }

}
