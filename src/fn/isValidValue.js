'use strict'

const isPlainObject = require('lodash/isPlainObject')
const isArray = require('lodash/isArray')
const isString = require('lodash/isString')
const isNumber = require('lodash/isNumber')
const isBoolean = require('lodash/isBoolean')

function isValidValue(value) {
  let type = typeof value
  return value !== undefined
    && (
      value === null ||
      isBoolean(value) ||
      isNumber(value) ||
      isString(value) ||
      isArray(value) ||
      isPlainObject(value)
    )
}

let isDebug = require('./isDebug')
let debugWrapper = require('./debugWrapper')

if (isDebug) {
  isValidValue = debugWrapper('isValidValue', isValidValue)
}

// @TODO: Concat these implementation to reduce
// fn calls
module.exports = isValidValue
