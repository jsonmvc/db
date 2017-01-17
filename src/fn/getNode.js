'use strict'
const splitPath = require('./splitPath')
const getValue = require('./getValue')
const setValue = require('./setValue')
const decomposePath = require('./decomposePath')
const err = require('./err')

let getNode = (db, path) => {
  let result
  // @TODO: If there is a schema and the dynamic node
  // then return an empty value for that type:
  // object -> {}
  // array -> []
  // string, number -> null
  //
  // @TODO: Dynamic nodes list underneath this path are already
  // computed and should be used in a for loop instead of a recursive
  // function
  //
  // @TODO: Before calling a dynamic node check if the arguments are the same
  // as before. If so, just take the last value and return
  //
  // @TODO: Create a hashmap for fn args using JSON.stringify and concatenating
  // the results in order to have an efficient comparison.
  //
  // @TODO: Reverse the order in which the node is retrieved:
  // let node = {}
  // let dynamic = []
  // if (isstatic) node = // static generation
  // if (isDynamic) dynamic.push(path)
  //
  // 
  // dynamic = dynamic.concat(db.dynamic.nesting[path])
  // // Go in reverse order because they are order based
  // on their nesting rules so if a node needs to result
  // from one of its siblings that is already generated
  // at the time of requiring the value
  // Also, because a dirty list can be generated
  // when patching, it means that list can be called instead.
  //
  // for (let i = dynamic.length - 1; i >= 0; i -= 1) {
  // }
  //
  // When the final object was generated a JSON.stringified copy
  // is saved so when a getNode on the same path is called 
  // and no dynamic node is dirty
  // and the path itself is not dirty then just
  // return the parsed cached value
  // Also store the node both as an object as stringified
  // The object will contain both the dynamic nodes value.
  // By checking which nodes are dirty then this object
  // can be used and only those values and again
  // stringified / kept as reference
  // By being kept as reference it will modify in place with
  // the new values and thus when a new call is made the
  // value won't need updating

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

  // console.log(db.dynamic.fns, path, decomposed)

  // Test to see if this is dynamic or if it's parents are dynamic


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
      let msg = e.toString()
      msg += `\n path: ${path}`
      msg += `\n node: ${dynamicParent}`
      err(db, '/err/types/node/5', msg)
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

  return result
}

let isDebug = require('./isDebug')
let debugWrapper = require('./debugWrapper')

if (isDebug) {
  getNode = debugWrapper('getNode', getNode, 1)
}

module.exports = getNode
