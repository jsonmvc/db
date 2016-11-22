var db = require('./../../src/index')()

var fn = x => x

/*
db.get('/foo')

db.patch({
  op: 'add',
  path: '/a/b/c/bam',
  value: 'bam'
})

db.patch({
  op: 'add',
  path: '/a/b/c/baz',
  value: 'baz'
})

db.patch({
  op: 'add',
  path: '/goo',
  value: 'This is goo'
})
*/

db.node('/foo', ['/a/b'], fn)
db.node('/a/b/c/bar', ['/c'], (x, y) => x + y)
db.node('/c/d', ['/f'], (x, y) => {
  x.baz += y
  return x
})
db.node('/f/x/j', ['/a/b/c'], x => x)

// console.log(JSON.stringify(db.get('/goo'), null, ' '))
