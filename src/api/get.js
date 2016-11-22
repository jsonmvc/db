'use strict'
const getNode = require('./../fn/getNode')


/**
 * get
 *
 * Gets a value
 */
module.exports = db => path => {
  return getNode(db, path)
}
