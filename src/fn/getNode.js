'use strict'
const splitPath = require('./splitPath')
const getValue = require('./getValue')
const setValue = require('./setValue')
const decomposePath = require('./decomposePath')
const err = require('./err')

const getNode = (db, path) => {
  let result
  // @TODO: If there is a schema and the dynamic node
  // then return an empty value for that type:
  // object -> {}
  // array -> []
  // string, number -> null
  //

  if (db.cache[path]) {
    return db.cache[path]
  }

  let defaultValue = null

  let decomposed = decomposePath(path)
  decomposed.unshift(path)

  let dynamicParent
  let dynamicChildren
  let isDynamic = false
  do {
    dynamicParent = decomposed.shift()

    if (db.dynamic.fns[dynamicParent]) {
      isDynamic = true
      dynamicChildren = path.substr(dynamicParent.length)
    }

  } while (decomposed.length != 0 && isDynamic === false)

  let dynamicChildrenBkp = dynamicChildren

  if (isDynamic) {
    let nodes = db.dynamic.deps[dynamicParent]
    let args = nodes.map(x => getNode(db, x))

    // @TODO: decide how to handle case that uses only
    // existing values vs nodes that handle non existing
    // values
    try {
      result = db.dynamic.fns[dynamicParent].apply(null, args)
      if (result === undefined) {
        result = defaultValue
        // @TODO: log this as an error, an edge case
        // that the developer didn't forsee when writing
        // his function
      }
    } catch(e) {
      result = defaultValue
      e.message += `\n path: ${path}`
      e.message += `\n node: ${dynamicParent}`
      err(db, '/err/types/node/5', e.message)
    }

    if (dynamicChildren) {
      dynamicChildren = dynamicChildren.split('/')
      dynamicChildren.shift()

      do {
        let child = dynamicChildren.shift()
        if (result) {
          result = result[child]
        } else {
          result = void 0
          break;
        }
      } while (dynamicChildren.length !== 0)

    }

  } else {
    let val = getValue(db.static, path)

    // If root was found
    if (val !== undefined) {

      if (val !== null && val.toString && val.toString() === '[object Object]') {
        let nodes = db.dynamic.nesting[path]

        if (nodes) {
          val = nodes.reduce((acc, x) => {
            let node = getNode(db, x)
            let root = x.replace(path, '')
            setValue(acc, root, node)
            return acc
          }, val)
        }

      } else {
        // val remains the same and does't need cloning
      }

    }

    result = val
  }

  /*
  if (result) {
    db.cache[path] = result

    if (dynamicChildrenBkp) {
      if (!db.cachedChildren[dynamicParent]) {
        db.cachedChildren[dynamicParent] = [path]
      } else {
        db.cachedChildren[dynamicParent].push(path)
      }
    }
  }
  */

  return result
}

module.exports = getNode
