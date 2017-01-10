'use strict'
const isString = require('lodash/isString')

function isValidPath(path) {
  return isString(path) && /^(\/[a-z0-9~\\\-%^|"\ ]*)+$/gi.test(path)
}

let isDebug = require('./isDebug')
let debugWrapper = require('./debugWrapper')

if (isDebug) {
  isValidPath = debugWrapper('isValidPath', isValidPath, 0)
}

module.exports = isValidPath
