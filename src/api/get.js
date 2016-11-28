'use strict'
const getNode = require('./../fn/getNode')
const isValidPath = require('./../fn/isValidPath')

/**
 * get
 *
 * Gets a value
 */
module.exports = db => path => {

  if (!isValidPath(path)) {
    return
  }

  return getNode(db, path)
}
