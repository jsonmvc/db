'use strict'
const schemaStructure = require('./../fn/schemaStructure')
const jsonPatch = require('fast-json-patch')

/**
 * schema
 *
 * Adds a schema
 */
module.exports = db => schema => {

  db.schema = schema

  let structure = schemaStructure(db.schema)

  let keys = Object.keys(structure)

  for (let i = 0, len = keys.length; i < len; i += 1) {
    jsonPatch.apply(db.static, [{
      op: 'add',
      path: `/${keys[i]}`,
      value: structure[keys[i]]
    }])
  }

  // for creating the full structure of data
  // json schema for validating current and future input
  // for ensuring dynamic nodes output correctly
  // for ensuring paths are created correctly

}
