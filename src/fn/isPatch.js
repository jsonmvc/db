'use strict'
const isValidPath = require('./isValidPath')
const isValidValue = require('./isValidValue')
const isPlainObject = require('lodash/isPlainObject')

module.exports = function isPatch(schema, patch) {

  if (patch instanceof Array !== true) {
    return false
  }

  for (let i = 0, len = patch.length; i < len; i += 1) {
      let x = patch[i]

      if (!(
        isPlainObject(x)
        && isValidPath(x.path)
        && (x.value ? isValidValue(x.value) : true)
        && (x.from ? isValidPath(x.from) : true)
        )
        /*
        && (
          ((x.op === 'add' || x.op === 'replace' || x.op === 'test' || x.op === 'merge') && isValidValue(x.value))
          || ((x.op === 'move' || x.op === 'copy') && isValidPath(x.from))
          || x.op === 'remove'
        )
        */
      ) {
        return false
      }

    }

  return true
}
