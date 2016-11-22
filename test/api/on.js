var db = require('./../../src/index')()

var fn1 = x => x
var fn2 = (x, y) => x + y
var fn3 = (x, y, z) => x + y + z

db.patch({
  op: 'add',
  path: '/a',
  value: {
    b: {
      c: 'foo'
    },
    d: {
      e: '123'
    }
  }
})

db.patch({
  op: 'add',
  path: '/b',
  value: {
    n: {
      m: 'bar'
    },
    d: {
      e: '321'
    }
  }
})

/*
db.node('/foo1', ['/a/b/c'], fn1)
db.node('/foo2', ['/foo1', '/a/d/e'], fn2)
db.node('/foo3', ['/foo2', '/b/n/m', '/b/d/e'], fn3)
*/

// console.log(db.db.dynamic.fns['/foo1'])
//console.log(JSON.stringify(db.db, null, ' '))
db.on('/b', x => {
  var b = db.get('/b')
  console.log('Updated', x)
})

db.patch({
  op: 'add',
  path: '/b/n/m',
  value: 'booo 123'
})

db.patch({
  op: 'add',
  path: '/b/k/m',
  value: 'brr'
})

// console.log(db.db.updates.triggers)

