'use strict'

const isDebug = require('./fn/isDebug')
if (isDebug) {
  if (typeof window !== 'undefined') {
    window.JSONMVC_DEBUG = {}

    function parseData(data, name) {
      let x = data[name]

      if (data.length) {
        x = data
      }

      let result = {
        name: name,
        count: x.length,
        time: x.reduce((acc, y) => { acc += y; return acc }, 0),
        longest: x.reduce((acc, y) => { return acc > y ? acc : y }, 0)
      }

      result.average = result.time / result.count

      return result
     }

    window.showLogs = function (name) {
      let data = JSONMVC_DEBUG[name]

     if (data.length) {
       data = [parseData(data, name)]
     } else {
       data = Object.keys(data).map(x => parseData(data, x))
     }

     console.table(data)
    }
  }
}

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
      patching: {},
      nesting: {},
      inverseDeps: {},
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
