'use strict'
const splitPath = require('./splitPath')
const decomposePath = require('./decomposePath')

function invalidateCache(db, changed) {
  let cacheDynamic = db.cache.dynamic
  let cachePaths = db.cache.paths
  let staticDeps = db.dynamic.staticDeps
  let decomposed = db.dynamic.decomposed

  let full = changed.full
  let i = changed.full.length
  let j
  let k
  let p
  let changedPath
  let changedPaths
  let part
  let staticDepList
  let dep
  let cacheDynamicList
  let cachedDynamic
  let decomposedList

  while (i--) {
    changedPath = full[i]

    changedPaths = decomposePath(changedPath)
    changedPaths.push(changedPath)

    j = changedPaths.length

    while (j--) {
      part = changedPaths[j]

      delete cachePaths[part]

      staticDepList = staticDeps[part]
      if (staticDepList) {
        k = staticDepList.length

        while (k--) {
          dep = staticDepList[k]

          cacheDynamicList = cacheDynamic[dep]
          if (cacheDynamicList) {
            p = cacheDynamicList.length
            while (p--) {
              delete cachePaths[cacheDynamicList[p]]
            }
          }

          decomposedList = decomposed[dep]
          p = decomposedList.length
          while (p--) {
            delete cachePaths[decomposedList[p]]
          }

        }
      }
    }
  }

  delete db.cache.paths['/']

}

module.exports = invalidateCache
