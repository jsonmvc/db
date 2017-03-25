'use strict'
const splitPath = require('./splitPath')
const decomposePath = require('./decomposePath')

function invalidateCache(db, changed) {

  changed.full.forEach(x => {

    let paths = decomposePath(x)
    paths.push(x)

    let affectedDynamic = paths.reduce((acc, y) => {
      if (db.dynamic.staticDeps[y]) {
        acc = acc.concat(db.dynamic.staticDeps[y])
      }
      return acc
    }, [])

    affectedDynamic.forEach(y => {
      if (db.cache.dynamic[y]) {
        db.cache.dynamic[y].forEach(t => {
          delete db.cache.paths[t]
        })
        db.cache.dynamic[y] = []
      }
    })

    paths.forEach(y => {
      delete db.cache.paths[y]
    })

  })

  delete db.cache.paths['/']

}

module.exports = invalidateCache
