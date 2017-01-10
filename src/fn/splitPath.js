'use strict'
function splitPath(path) {
  path = path.replace(/~0/g, '~')
  path = path.replace(/~1/g, '/')
  path = path.split('/')
  path.shift()

  return path
}

let isDebug = require('./isDebug')
let debugWrapper = require('./debugWrapper')

if (isDebug) {
  splitPath = debugWrapper('splitPath', splitPath, 0)
}

module.exports = splitPath
