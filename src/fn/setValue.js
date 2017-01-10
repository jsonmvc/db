'use strict'
const splitPath = require('./splitPath')

function setValue(obj, path, val) {
  let parts = splitPath(path)
  let ref = obj

  for (let i = 0; i < parts.length; i += 1) {
    ref[parts[i]] = val
  }
}

let isDebug = require('./isDebug')
let debugWrapper = require('./debugWrapper')

if (isDebug) {
  setValue = debugWrapper('setValue', setValue, 1)
}

module.exports = setValue
