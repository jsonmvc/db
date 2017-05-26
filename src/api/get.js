
import getNode from './../fn/getNode'
import isValidPath from './../isValidPath'

/**
 * get
 *
 * Gets a value
 */
const get = db => path => {

  if (!isValidPath(path)) {
    return
  }

  return getNode(db, path)
}

export default get
