var apply = require('./src/fn/applyPatch')
var json = require('fast-json-patch')

var db = {
  static: {}
}

var patch = [{
  op: 'add',
  path: '/foo/bar/baz',
  value: {
    qux: 123,
    blo: 321

  }
}, {
  op: 'remove',
  path: '/foo/bar/baz/qux'
}, {
  op: 'move',
  path: '/foo/bam',
  from: '/foo/bar/baz/blo'
}, {
  op: 'copy',
  path: '/foo/blro',
  from: '/foo/bam'
}, {
  op: 'replace',
  path: '/foo/blro',
  value: '123'
}, {
  op: 'test',
  path: '/foo/blro',
  value: '123'
}, {
  op: 'add',
  path: '/arr',
  value: [1, 2]
}, {
  op: 'add',
  path: '/arr/-',
  value: 5
}, {
  op: 'add',
  path: '/arr/10',
  value: 50
}, {
  op: 'merge',
  path: '/foo',
  value: 123
}]

db.static = {
  foo: [1, 2]
}

patch = [{
  op: 'add',
  path: '/foo/1e0',
  value: 5
}]

var result = apply(db, patch)

console.log(JSON.stringify(db, null, ' '))
console.log(result)