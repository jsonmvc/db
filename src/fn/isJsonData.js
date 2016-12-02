'use strict'
const isEqual = require('lodash/isEqual')

module.exports = function isJsonData(data) {
  // @TODO: Find another way to do this, it's way too
  // expensive
  try {
    let data2 = JSON.parse(JSON.stringify(data))

    if (!isEqual(data, data2)) {
      return false
    }

  } catch (e) {
    return false
  }

  return true
}
