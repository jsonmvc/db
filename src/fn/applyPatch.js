'use strict'
const isEqual = require('lodash/isEqual')
const isNumber = require('lodash/isNumber')
const merge = require('lodash/merge')
const splitPath = require('./splitPath')
const decomposePath = require('./decomposePath')

module.exports = function applyPatch(db, patch) {

  let i, x, parts, len, j, lenj, obj, part, last, to, found

  let revert
  root:
  for (i = 0, len = patch.length; i < len; i += 1) {
    x = patch[i]

    parts = splitPath(x.path)

    // @TODO: Implement search logic to go through refs
    // to find the node. During the bottom-up search if the
    // path does not exists create an object that up to
    // the found path will be added to the tree (depending
    // on the operation)

    obj = db.static
    for (j = 0, lenj = parts.length - 1; j < lenj; j += 1) {

      part = parts[j]
      if (!obj[part] && x.op === 'add') {
        obj[part] = {}
        obj = obj[part]
      } else {
        obj = obj[part]
        if (!obj) {
          revert = i
          break root
        }
      }
    }

    last = parts[parts.length - 1]
    switch (x.op) {

      case 'add':
      case 'replace':
        if (obj instanceof Array) {
          if (last === '-') {
            last = obj.length
          } else if (!isNumber(last)) {
            // Must be a number, else what's the point in
            // trying to cast it to one?
            let initial = last
            last = parseInt(last, 10)

            if (isNaN(last) || initial.toString() !== last.toString()) {
              revert = i
              break root
            }
          }
          obj.splice(last, 0, x.value)
        } else if (obj instanceof Object) {
          obj[last] = x.value
        } else {
          revert = i
          break root
        }
      break

      case 'remove':
        delete obj[last]
      break

      case 'copy':
      case 'move':
        parts = splitPath(x.from)

        to = obj
        obj = db.static
        for (j = 0, lenj = parts.length - 1; j < lenj; j += 1) {
          if (obj[parts[j]])  {
            obj = obj[parts[j]]
          } else {
            revert = i
            break
          }
        }

        to[last] = obj[parts[parts.length - 1]]

        if (x.op === 'move') {
          delete obj[parts[parts.length - 1]]
        }
      break

      case 'test':
        if (!isEqual(obj[last], x.value)) {
          revert = i
          break root
        }
      break

      case 'merge':
        if (!(obj[last] instanceof Object)) {
          revert = i
          break root
        }
        obj[last] = merge(obj[last], x.value)
      break
    }

  }

  if (revert) {
    console.error('Should revert from ' + revert + ' backwards')
  }

  return revert === undefined

}
