'use strict'

module.exports = function isValidPath(path) {
  return /^(\/[a-z0-9~\\\-%^|"\ ]*)*$/gi.test(path)
}

