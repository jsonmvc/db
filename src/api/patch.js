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
const pathTriggers = require('./../fn/pathTriggers')
const invalidateCache = require('./../fn/invalidateCache')
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

  if (shouldValidate) {
    try {
      patch = JSON.parse(JSON.stringify(patch))
    } catch (e) {
      err(db, '/err/types/patch/3', {})
      return
    }
  }

  // @TODO by the way object data that is passed
  // through reference might need copying before
  // applying the patch
  let result = applyPatch(db, patch, shouldClone)

  if (result.revert !== undefined) {
    err(db, '/err/types/patch/2', patch)
    return result
  }

  let trigger = []

  patch.forEach(x => {
    trigger = trigger.concat(pathTriggers(db, x.path))
  })

  trigger = flatten(trigger)

  trigger.map(x => {
    triggerListener(db, x)
  })
}
