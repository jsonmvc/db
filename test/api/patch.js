'use strict'
const db = require('./../../src/index')()

db.patch({
  op: 'add',
  path: '/a/b/#dis .foo[data-path="asdf"]:nth-child(2)[attr^=val]',
  value: 'foo'
})

let val = db.get('/a/b/#dis .foo[data-path="asdf"]:nth-child(2)[attr^=val]')
console.log('/a/b is ', val)
