const splitPath = require('./splitPath')

function setCache(db, path, value) {
  let parts = splitPath(path)

  // If there's a dynamic path of some sort here
  // then store it somehow so that it can be
  // recognized
  // else just store it plain
  // - move the responsability to the patching
  // system to give all the paths that have
  // been changed

  db.cache.paths[path] = value

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
}

module.exports = setCache
