'use strict'
const splitPath = require('./splitPath')

module.exports = (tree, path, val) => {
  path = splitPath(path)

  let ref = tree
  let patches = []
  for (let i = 0; i < path.length - 1; i += 1) {
    if (!ref.hasOwnProperty(path[i])) {
      patches.push({
        op: 'add',
        path: `/${path.slice(0, i + 1).join('/')}`,
        value: {}
      })
    }
  }

  return patches
}
