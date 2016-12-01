'use strict'
const jsonPatch = require('fast-json-patch')
const getValue = require('./../fn/getValue')
const nestingPatches = require('./../fn/nestingPatches')
const decomposePath = require('./../fn/decomposePath')
const uniq = require('uniq')
const flatten = require('lodash/flattenDeep')
const triggerListener = require('./../fn/triggerListener')
const splitPath = require('./../fn/splitPath')
const merge = require('json-merge-patch')
const isPlainObject = require('lodash/isPlainObject')
const isValidPath = require('./../fn/isValidPath')
const isValidValue = require('./../fn/isValidValue')

/**
 * patch
 *
 * Applies a patch
 */
module.exports = db => {
  const err = require('./../fn/err')
  return function patchDb(patch) {

    if (patch instanceof Array !== true) {
      throw JSON.stringify(patch)
      patch = [patch]
    }

    /*
    for (let i = 0, len = patch.length; i < len; i += 1) {
      let x = patch[i]

      if (
        x.constructor === Object
        && isValidPath(x.path)
        && (
          ((x.op === 'add' || x.op === 'replace' || x.op === 'test' || x.op === 'merge') && isValidValue(x.value))
          || ((x.op === 'move' || x.op === 'copy') && isValidPath(x.from))
          || x.op === 'remove'
        )
      ) {
        let y = {
          op: x.op,
          path: x.path
        }
        if ((x.op === 'add' || x.op === 'replace' || x.op === 'test' || x.op === 'merge')) {
          // @TODO: If schema, test if value is valid based on path
          y.value = x.value
        } else if ((x.op === 'move' || x.op === 'copy')) {
          y.from = x.from
        }
        patch[i] = y
      } else {
        err(db, '/err/types/patch/1', patch)
        return
      }

    }
    */

    //@TODO: Move this checking in patch checking
    if (
      !(
        patch instanceof Array === true
        || (
          patch !== undefined
          && patch.toString
          && patch.toString() === '[object Object]'
          && typeof patch !== 'string'
        )
      )
    ) {
      err(db, '/err/types/patch/1', patch)
      return
    }

    try {
      // Check if root exists for add operations
      patch.forEach(x => {

        if (x.path === '') {
          throw 'Changing the root is not allowed'
        }

        let path = x.path.split('/')
        path = path.slice(0, path.length - 1).join('/')

        if ((x.op === 'add' || x.op === 'merge') && getValue(db.static, path) === undefined) {
          let patches = nestingPatches(db.static, x.path)
          jsonPatch.apply(db.static, patches)
        }
      })

      let merges = []
      patch = patch.filter(x => {
        if (x.op === 'merge') {
          merges.push(x)
          return false
        } else {
          return true
        }
      })

      merges.forEach(x => {
        let parts = splitPath(x.path)
        let val = db.static

        for (let i = 0; i < parts.length; i += 1) {
          if (val[parts[i]]) {
            val = val[parts[i]]
          } else {
            val = undefined
            break
          }
        }

        if (val !== undefined) {
          val = merge.apply(val, x.value)
        } else {
          err(db, '/err/types/patch/1', x)
        }
      })

      // @TODO by the way object data that is passed
      // through reference might need copying before
      // applying the patch
      let result
      result = jsonPatch.apply(db.static, patch, true)

      let trigger = []

      // @TODO: Dirty checking and triggering updates
      // can happen in an asyncCall to further optimize
      // patching speed

      // @TODO: In order to optimize the checking
      // of getNode when dealing with dynamic nodes
      // flag which ones are dirty and need reevaluation
      // And that minimal list will be computed
      // when calling getNode

      patch.forEach(x => {
        let parts = decomposePath(x.path)
        parts.push(x.path)
        parts.forEach(y => {
          if (db.updates.triggers[y]) {
            trigger.push(db.updates.triggers[y])
          }
        })
      })

      trigger = flatten(trigger)
      trigger = uniq(trigger)

      trigger.map(x => {
        triggerListener(db, x)
      })
    } catch (e) {
      err(db, '/err/types/patch/1', patch)
      return
    }
  }
}
