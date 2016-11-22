'use strict'
const splitPath = require('./splitPath')
const getValue = require('./getValue')
const setValue = require('./setValue')

const getNode = (db, path) => {
  let result

  if (db.dynamic.fns[path]) {
    let nodes = db.dynamic.deps[path]
    let args = nodes.map(x => getNode(db, x))
    result = db.dynamic.fns[path].apply(null, args)
  } else {
    let val = getValue(db.static, path)

    // If root was found
    if (val !== undefined) {

      if (val instanceof Object === true) {
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

module.exports = getNode
