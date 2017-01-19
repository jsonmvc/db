'use strict'
const getValue = require('./../fn/getValue')
const decomposePath = require('./../fn/decomposePath')
const uniq = require('uniq')
const flatten = require('lodash/flattenDeep')
const isObjectLike = require('lodash/isObjectLike')
const isArray = require('lodash/isArray')
const triggerListener = require('./../fn/triggerListener')
const splitPath = require('./../fn/splitPath')
const isPatch = require('./../fn/isPatch')
const applyPatch = require('./../fn/applyPatch')
const err = require('./../fn/err')

function getAffected(db, path) {
  let nodes = [path]
  let inverse = db.dynamic.inverseDeps[path]
  let deps = db.dynamic.reverseDeps[path]

  if (deps) {
    if (inverse) {
      deps = deps.concat(inverse)
    }
    nodes = nodes.concat(deps)
    deps.forEach(x => {
      nodes = nodes.concat(getAffected(db, x))
    })
  }

  if (inverse) {
    nodes = nodes.concat(inverse)
  }


  return nodes
}

/**
 * patch
 *
 * Applies a patch
 */
module.exports = db => (patch, shouldValidate, shouldClone) => {

  shouldValidate = shouldValidate !== undefined ? shouldValidate : true
  shouldClone = shouldClone !== undefined ? shouldClone : true

  if (shouldValidate && !isPatch(db.schema, patch)) {
    err(db, '/err/types/patch/1', patch)
    return
  }

  // @TODO by the way object data that is passed
  // through reference might need copying before
  // applying the patch
  let result
  result = applyPatch(db, patch, shouldClone)

  if (!result) {
    err(db, '/err/types/patch/2', patch)
    return result
  }

  // Refresh caching
  let no = patch.length
  let affected = []
  for (let i = 0; i < no; i += 1) {
    let d = patch[i]
    let parts = decomposePath(d.path)
    parts.push(d.path)

    if (db.cachedNested[d.path]) {
      affected = affected.concat(db.cachedNested[d.path])
    }

    for (let j = 0; j < parts.length; j += 1) {
      let part = parts[j]
      affected = affected.concat(getAffected(db, part))
    }

    if (d.op === 'merge') {

      function recurseAffected(value, path) {
        if (isObjectLike(value)) {
          Object.keys(value).forEach(x => {
            let newPath = path === '/' ? '/' + x : path + '/' + x
            affected.push(newPath)
            recurseAffected(value[x], newPath)
          })
        } else {
          affected.push(path)
        }
      }

      recurseAffected(d.value, d.path)
    }

  }

  affected.forEach(x => {
    delete db.cache[x]

    let children = db.cachedChildren[x]

    if (children) {
      children.forEach(x => {
        delete db.cache[x]
      })

      delete db.cachedChildren[x]
    }

  })

  let trigger = []

  patch.forEach(x => {
    let parts = decomposePath(x.path)
    parts.push(x.path)

    parts.forEach(y => {
      if (db.updates.triggers[y]) {
        trigger.push(db.updates.triggers[y])
      }
    })
  })

  patch.forEach(x => {
    let dep = db.dynamic.inverseDeps[x.path]

    if (dep) {
      trigger = trigger.concat(dep)
    }
  })

  trigger = flatten(trigger)
  trigger = uniq(trigger)

  trigger.map(x => {
    triggerListener(db, x)
  })
}
