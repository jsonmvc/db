const db = require('./../../src/index')()

db.patch({
  op: 'add',
  path: '/a/b',
  value: '123'
})

console.log('Result', db.get('/a/b'))

