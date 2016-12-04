'use strict'
const isEqual = require('lodash/isEqual')
const isPlainObject = require('lodash/isPlainObject')
const merge = require('lodash/merge')
const splitPath = require('./splitPath')
const decomposePath = require('./decomposePath')
const clone = require('lodash/cloneDeep')

module.exports = function applyPatch(db, patch, shouldClone) {
  let revert
  let len = patch.length
  let i = 0


  root:
  while (i < len) {
    let x = patch[i]

    let op = x.op
    let from = x.from
    let path = x.path
    let value = x.value
    let pathParts = path.split('/')
    let len = pathParts.length - 1
    let last = pathParts[len]

    // Store the refs of the children with ref to their partents
    // e.g. parent of
    let obj = db.refs[path]
    if (obj === undefined) {
      let curUp = 1
      obj = db.static
      while (curUp < len) {
        obj = obj[pathParts[curUp++]]
      }
    }

    if (op === 'add' || op === 'replace') {
        //if (pathRef.isArray) {
        //  pathRef.obj.splice(pathRef.last, 0, shouldClone ? clone(value) : value)
        //} else {
          obj[last] = value // shouldClone ? clone(value) : value
        //}
    } else if (op === 'merge') {
      if (!isPlainObject(pathRef.obj[pathRef.last])) {
        revert = i
        break root
      }
      pathRef.obj[pathRef.last] = merge(pathRef.obj[pathRef.last], value)
    } else if (op === 'remove') {
      if (pathRef.isArray) {
        pathRef.obj.splice(pathRef.last, 1)
      } else {
        delete pathRef.obj[pathRef.last]
      }
    } else if (op === 'copy' || op === 'move') {
      let temp
      temp = fromRef.obj[fromRef.last]

      if (op === 'move') {
        delete fromRef.obj[fromRef.last]
      } else if (isPlainObject(temp)) {
        temp = clone(temp)
      }

      pathRef.obj[pathRef.last] = temp
    } else if (op === 'test') {
      if (!isEqual(pathRef.obj[pathRef.last], value)) {
        revert = i
        break root
      }
    }

    i += 1
  }

  if (revert !== undefined) {
    // @TODO: Revert all changes done up until revertIndex
  }

  return revert === undefined
}
