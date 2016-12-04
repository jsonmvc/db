'use strict'
const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/fn/isValidPath.yml`, 'utf-8')

const tests = require('yaml-js').load(testsFile)
const getRef = require(`${root}/src/fn/getRef`)
const dbFn = require(`${root}/src/index`)

it('should get path without ref', () => {
  let db = dbFn({
    foo: {
      bar: {
        baz: {
          boo: [{ foo: 123 }, { bar: 123 }]
        }
      }
    }
  })

  let ref = getRef(db.db, '/foo/bar/baz/boo/0/foo')

  expect(ref.obj).toBe(db.db.static.foo.bar.baz.boo[0])
  expect(ref.last).toBe('foo')
})

it('should get path with ref', () => {
  let db = dbFn({
    foo: {
      bar: {
        baz: {
          boo: [{ foo: 123 }, { bar: 123 }]
        }
      }
    }
  })

  db.db.refs = {
    '/foo/bar/baz/boo': db.db.static.foo.bar.baz.boo
  }

  let ref = getRef(db.db, '/foo/bar/baz/boo/0/foo')

  expect(ref.obj).toBe(db.db.static.foo.bar.baz.boo[0])
  expect(ref.last).toBe('foo')

})


it('should properly return an array', () => {
  let db = dbFn({
    foo: {
      bar: {
        baz: {
          boo: [{ foo: 123 }, { bar: 123 }]
        }
      }
    }
  })

  db.db.refs = {
    '/foo/bar': db.db.static.foo.bar
  }

  let ref = getRef(db.db, '/foo/bar/baz/boo/0')

  expect(ref.obj).toEqual(db.db.static.foo.bar.baz.boo)
  expect(ref.last).toBe(0)

})
