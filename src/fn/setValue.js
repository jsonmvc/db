'use strict'
const splitPath = require('./splitPath')

module.exports = (obj, path, val) => {
  let parts = splitPath(path)
  let ref = obj

  for (let i = 0; i < parts.length; i += 1) {
    if (parts.length - 1 === i) {
      ref[parts[i]] = val
    } else {
      ref = ref[parts[i]]
    }
  }

}
