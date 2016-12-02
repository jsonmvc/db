'use strict'
const isValidPath = require('./isValidPath')
const isValidValue = require('./isValidValue')
const isJsonData = require('./isJsonData')
const isPlainObject = require('lodash/isPlainObject')
const diff = require('lodash/difference')

const patchProps = [
  'add',
  'copy',
  'remove',
  'move',
  'test',
  'replace',
  'from',
  'value',
  'path',
  'op'
]

module.exports = function isPatch(schema, patch) {

  if (patch instanceof Array !== true) {
    return false
  }

  if (!isJsonData(patch)) {
    return false
  }

  for (let i = 0, len = patch.length; i < len; i += 1) {
      let x = patch[i]

      if (!(
        isPlainObject(x)
        && isValidPath(x.path)
        && (x.value ? isValidValue(x.value) : true)
        && (x.from ? isValidPath(x.from) : true)
        && diff(Object.keys(x), patchProps).length === 0
        )
      ) {
        return false
      }

    }

  return true
}
