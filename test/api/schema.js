const db = require('./../../src/index')()
const schema = require('./../data/schema.json')

db.schema(schema)

console.log('Has ', db.has('/address/streetAddress'))
console.log('Has ', db.has('/address'))
