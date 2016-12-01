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

/**
 * patch
 *
 * Applies a patch
 */
module.exports = db => {
  const err = require('./../fn/err')
  return function patchDb(patch) {


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

    patch = patch instanceof Array ? patch : [patch]


    for (let i = 0, len = patch.length; i < len; i += 1) {

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
          patch(db)({
            op: 'add',
            path: '/err/patch/-',
            value: 'Path ' + x.path + ' does not exists for a merge'
          })
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
      patchDb({
        op: 'add',
        path: '/err/patch/-',
        value: e.toString()
      })
      return
    }
  }
}
