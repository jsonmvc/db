'use strict'
const on = require('./api/on')
const get = require('./api/get')
const has = require('./api/has')
const patch = require('./api/patch')
const node = require('./api/node')
const schema = require('./api/schema')

module.exports = () => {

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
