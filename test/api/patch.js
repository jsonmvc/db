'use strict'
const db = require('./../../src/index')()

db.patch({
  op: 'add',
  path: '/a/b/#dis .foo[data-path="asdf"]:nth-child(2)[attr^=val]',
  value: 'foo'
})

let val = db.get('/a/b/#dis .foo[data-path="asdf"]:nth-child(2)[attr^=val]')
console.log('/a/b is ', val)

db.patch({
  op: 'add',
  path: '/a',
  value: {
    b: 123
  }
})

db.patch({
  op: 'merge',
  path: '/a',
  value: {
    c: 123
  }
})

console.log('/a is ', db.get('/a'))

db.patch({
  op: 'add',
  path: '/ajax/data',
  value: {}
})

db.patch({
  op: 'add',
  path: '/ajax/data/BkYKKLffx/attempts',
  value: 123
})

console.log(db.get('/ajax/data/BkYKKLffx/attempts'))
