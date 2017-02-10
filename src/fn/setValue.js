'use strict'
const splitPath = require('./splitPath')

module.exports = (obj, path, val) => {
  let parts = splitPath(path)
  let ref = obj

  while (parts.length > 1) {
    ref = ref[parts.shift()]
  }

  if (ref) {
    ref[parts.shift()] = val
  }

  return obj
}
