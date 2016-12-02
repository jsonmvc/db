'use strict'
const isString = require('lodash/isString')

module.exports = function isValidPath(path) {
  return isString(path) && /^(\/[a-z0-9~\\\-%^|"\ ]*)+$/gi.test(path)
}

