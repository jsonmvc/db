const db = require('./../../src/index')()

db.patch({
  op: 'add',
  path: '/a/b',
  value: 'foo'
})

console.log('Has static', db.has('/a/b'))

db.node('/foo/bar', ['/a/b'], x => x)

console.log('Has dynamic', db.has('/foo/bar'))

console.log('Should be false: ', db.has('/boo/bar'))
