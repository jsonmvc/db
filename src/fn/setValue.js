'use strict'
const splitPath = require('./splitPath')

module.exports = (obj, path, val) => {
  let parts = splitPath(path)
  let ref = obj

  let last = parts.pop()

  for (let i = 0; i < parts.length; i += 1) {

    if (ref[parts[i]] !== undefined) {
      ref = ref[parts[i]]
    } else {
      ref = undefined
      break
    }
  }

  if (ref) {
    ref[last] = val
  }

}
