'use strict'
const on = require('./api/on')
const get = require('./api/get')
const has = require('./api/has')
const patch = require('./api/patch')
const node = require('./api/node')

require('setimmediate')

module.exports = data => {


  // @TODO: Add on the static tree the following:
  // - nesting: gives all the dynamic nodes (with their siblings)
  // - dirty: a value has changed
  // -
  let db = {
    static: {
      err: {
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
    if (data.toString() !== '[object Object]') {
      throw new Error('The data must be an object')
    }

    db.static = JSON.parse(JSON.stringify(data))
    db.static.err = {
      patch: [],
      node: [],
      on: []
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
