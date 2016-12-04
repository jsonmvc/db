'use strict'
const on = require('./api/on')
const get = require('./api/get')
const has = require('./api/has')
const patch = require('./api/patch')
const node = require('./api/node')
const err = require('./fn/err')

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
    },
    refs: {}
  }

  if (data) {
    let datac = JSON.parse(JSON.stringify(data))
    if (typeof datac === 'string' || datac.toString() !== '[object Object]') {
      err(db, '/err/types/db/1', datac)
    } else if (datac.err) {
      err(db, '/err/types/db/2', datac)
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
