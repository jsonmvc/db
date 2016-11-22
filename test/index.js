'use strict'

const api = require('./../src/api')

var d = {}
var fn = x => x

api.node({
  path: '/a',
  fn: fn,
  nodes: ['/b/c']
})

api.node({
  path: '/b/c',
  fn: fn,
  nodes: ['/d']
})

api.node({
  path: '/d/f/b/t',
  fn: fn,
  nodes: ['/d']
})

api.patch({
  op: 'add',
  path: '/foo',
  value: {
    bar: {}
  }
})

api.patch({
  op: 'add',
  path: '/foo/bar',
  value: '123'
})

console.log(JSON.stringify(api.db, null, ' '))

