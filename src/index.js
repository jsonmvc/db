'use strict'
const on = require('./api/on')
const get = require('./api/get')
const has = require('./api/has')
const patch = require('./api/patch')
const node = require('./api/node')
const err = require('./fn/errPatch')

const errTypes = require('./errors.json')

require('setimmediate')

module.exports = data => {

  // An error message should contain:
  // 1. Error number
  // 2. Location
  // 3. Description (text)
  // 4. Resource type (that triggered the error)
  // 5. Resource value (if applicable)
  // 6. Resource id (if applicable)

  // @TODO: Implement dedupe arrays for all db arrays
  // @TODO: Store patches with a flag (true / false) if applied
  // and give them an ID so that they can be referenced in error
  // objects.
  // When storing patches, store them in nested arrays
  // so that correct patching can be applied at a later time

  // @TODO: Add on the static tree the following:
  // - nesting: gives all the dynamic nodes (with their siblings)
  // - dirty: a value has changed
  let db = {
    static: {
      err: {
        types: errTypes,
        db: [],
        patch: [],
        node: [],
        on: []
      }
    },
    dynamic: {
      nesting: {},
      deps: {},
      fns: {}
    },
    updates: {
      cache: {},
      triggers: {},
      fns: {}
    }
  }

  if (data) {
    let datac = JSON.parse(JSON.stringify(data))
    if (typeof datac === 'string' || datac.toString() !== '[object Object]') {
      err(db, '/err/types/db/1',  {
        value: datac
      })
    } else if (datac.err) {
      err(db, '/err/types/db/2', {
        value: datac
      })
    } else {
      db.static = JSON.parse(JSON.stringify(data))
      db.static.err = {
        types: errTypes,
        db: [],
        patch: [],
        node: [],
        on: []
      }
    }
  }

  return {
    on: on(db),
    get: get(db),
    has: has(db),
    patch: patch(db),
    node: node(db),
    db: db
  }
}
