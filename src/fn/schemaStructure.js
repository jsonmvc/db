'use strict'

module.exports = function schemaStructure(schema) {

  if (schema['properties']) {
    schema = schema.properties
  } else if (schema['patternProperties']) {
    schema = schema.patternProperties
  }

  let keys = Object.keys(schema)

  let obj = {}

  // @TODO: Only add the properties to the object
  // if they are in the required list
  for (let i = 0; i < keys.length; i += 1) {
    let key = keys[i]
    let val = schema[key]

    if (
      val.type === 'object'
      && val.properties instanceof Object === true
    ) {
      obj[key] = schemaStructure(val.properties)
    } else {
      let newVal = null
      if (val.type === 'object') {
        newVal = {}
      } else if (val.type === 'array') {
        newVal = []
      }

      obj[key] = newVal

      if (val.default) {
        obj[key] = val.default
      }

    }

  }

  return obj
}
