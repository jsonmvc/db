'use strict'
const on = require('./api/on')
const get = require('./api/get')
const has = require('./api/has')
const patch = require('./api/patch')
const node = require('./api/node')
const schema = require('./api/schema')

module.exports = data => {


  // @TODO: Add on the static tree the following:
  // - nesting: gives all the dynamic nodes (with their siblings)
  // - dirty: a value has changed
  // -
  let db = {
    static: {},
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
    schema: {}
  }

  if (data) {
    if (data.toString() !== '[object Object]') {
      throw new Error('The data must be an object')
    }

    db.static = JSON.parse(JSON.stringify(data))

  }

  return {
    on: on(db),
    get: get(db),
    has: has(db),
    patch: patch(db),
    node: node(db),
    schema: schema(db),
    db: db
  }
}
