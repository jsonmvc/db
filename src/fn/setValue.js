'use strict'
const splitPath = require('./splitPath')

module.exports = (obj, path, val) => {
  let parts = splitPath(path)
  let ref = obj

  for (let i = 0; i < parts.length; i += 1) {
    ref[parts[i]] = val
  }

}
