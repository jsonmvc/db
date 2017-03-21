'use strict'
const isEqual = require('lodash/isEqual')
const isNumber = require('lodash/isNumber')
const isArray = require('lodash/isArray')
const isPlainObject = require('lodash/isPlainObject')
const merge = require('lodash/merge')
const splitPath = require('./splitPath')
const decomposePath = require('./decomposePath')
const clone = require('lodash/cloneDeep')

module.exports = function applyPatch(db, patch, shouldClone) {

  let i, x, parts, len, j, lenj, obj, part, last, to, found, temp, from, lastFrom
  let objIsArray = false
  let fromIsArray = false
  let revert

  let cache = {
    partial: [],
    full: []
  }

  root:
  for (i = 0, len = patch.length; i < len; i += 1) {
    x = patch[i]

    // @TODO: Implement both path && from in a function

    parts = splitPath(x.path)
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

    if (x.op === 'move' || x.op === 'copy') {
      parts = splitPath(x.from)
      from = db.static
      for (j = 0, lenj = parts.length - 1; j < lenj; j += 1) {
        if (from[parts[j]])  {
          from = from[parts[j]]
        } else {
          revert = i
          break
        }
      }

      lastFrom = parts[parts.length - 1]
    }

    if (isArray(obj)) {
      objIsArray = true
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
      if (last > obj.length || last < 0) {
        revert = i
        break root
      }
    }

    if (isArray(from)) {
      fromIsArray = true
      if (lastFrom === '-') {
        lastFrom = from.length - 1
      } else if (!isNumber(lastFrom)) {
        // Must be a number, else what's the point in
        // trying to cast it to one?
        let initial = lastFrom
        lastFrom = parseInt(lastFrom, 10)

        if (isNaN(lastFrom) || initial.toString() !== lastFrom.toString()) {
          revert = i
          break root
        }
      }
      if (lastFrom > from.length || lastFrom < 0) {
        revert = i
        break root
      }
    }

    switch (x.op) {

      case 'add':
      case 'replace':

        if (objIsArray) {
          obj.splice(last, 0, shouldClone ? clone(x.value) : x.value)
        } else if (isPlainObject(obj)) {
          obj[last] = shouldClone ? clone(x.value) : x.value
        }

        cache.full.push(x.path)
      break

      case 'remove':
        if (objIsArray) {
          obj.splice(last, 1)
        } else {
          delete obj[last]
        }

        cache.full.push(x.path)
      break

      case 'copy':
      case 'move':

        temp = from[lastFrom]

        if (x.op === 'move') {
          delete from[lastFrom]
          cache.full.push(x.from)
        } else if (isPlainObject(temp)) {
          temp = clone(temp)
        }

        obj[last] = temp
        cache.full.push(x.path)

      break

      case 'test':
        if (!isEqual(obj[last], x.value)) {
          revert = i
          break root
        }
      break

      case 'merge':
        if (!isPlainObject(obj[last])) {
          revert = i
          break root
        }
        obj[last] = merge(obj[last], x.value)
        cache.full.push(x.path)
      break
    }

  }

  if (revert !== undefined) {
    // @TODO: Revert all changes done up until revertIndex
  }

  return {
    revert,
    cache
  }
}
