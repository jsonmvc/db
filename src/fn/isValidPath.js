'use strict'

module.exports = function isValidPath(path) {
  return typeof path === 'string' && /^(\/[a-z0-9~\\\-%^|"\ ]*)*$/gi.test(path)
}

