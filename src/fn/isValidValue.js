'use strict'

const isPlainObject = require('lodash/isPlainObject')
const isArray = require('lodash/isArray')
const isString = require('lodash/isString')
const isNumber = require('lodash/isNumber')
const isBoolean = require('lodash/isBoolean')

// @TODO: Concat these implementation to reduce
// fn calls
module.exports = function isValidValue(value) {
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
