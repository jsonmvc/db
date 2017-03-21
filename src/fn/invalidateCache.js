'use strict'
const splitPath = require('./splitPath')

function invalidateCache(db, changed) {

  changed.full.forEach(x => {
    let parts = splitPath(x)

    let ref = db.cache.tree

    for (let i = 0; i < parts.length; i += 1) {
      let part = parts[i]
      ref = ref[part]

      if (ref) {
        delete db.cache.paths[ref.path]
        ref = ref.children
      } else {
        break
      }
    }


  })


}

module.exports = invalidateCache
