'use strict'
const jsonPatch = require('fast-json-patch')
const getValue = require('./../fn/getValue')
const decomposePath = require('./../fn/decomposePath')
const uniq = require('uniq')
const flatten = require('lodash/flattenDeep')
const triggerListener = require('./../fn/triggerListener')
const splitPath = require('./../fn/splitPath')
const merge = require('json-merge-patch')
const isPatch = require('./../fn/isPatch')
const applyPatch = require('./../fn/applyPatch')
const err = require('./../fn/err')

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
}
