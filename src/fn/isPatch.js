'use strict'
const isValidPath = require('./isValidPath')
const isValidValue = require('./isValidValue')
const isJsonData = require('./isJsonData')
const isPlainObject = require('lodash/isPlainObject')
const diff = require('lodash/difference')

const props = [
  'from',
  'value',
  'path',
  'op'
]

const ops = [
  'add',
  'remove',
  'replace',
  'copy',
  'move',
  'test',
  'merge'
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
      && diff(Object.keys(x), props).length === 0
      && ops.indexOf(x.op) !== -1
      && ((x.op === 'add' || x.op === 'replace' || x.op === 'test') ? isValidValue(x.value) : true)
      && ((x.op === 'move' || x.op === 'copy') ? isValidPath(x.from) : true)
      )
    ) {
      return false
    }

  }

  return true
}
