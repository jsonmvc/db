const pathExists = require('./../fn/pathExists.js')

/**
 * has
 *
 * Checks if a path exists
 */
module.exports = db => path => {
  return pathExists(db, path)
}
