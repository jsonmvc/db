const splitPath = require('./splitPath')
const clone = require('lodash').cloneDeep

function setCache(db, path, value) {

  db.cache.paths[path] = clone(value)

  if (db.cache.initialized[path] !== true) {
    let parts = splitPath(path)
    let ref = db.cache.tree
    let curPath = ''
    parts.forEach(x => {
      curPath += '/' + x
      if (!ref[x]) {
        ref[x] = {
          path: curPath,
          children: {}
        }
      }
      ref = ref[x].children
    })

    db.cache.initialized[path] = true
  }

}

module.exports = setCache
