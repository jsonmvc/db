'use strict'

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/api/node.yml`, 'utf-8')
const tests = require('yaml-js').load(testsFile)
const dbFn = require(`${root}/src/index`)
const decomposePath = require(`${root}/src/fn/decomposePath`)
const splitPath = require(`${root}/src/fn/splitPath`)

const concat = function () {
  return Array.prototype.join.call(arguments, '-')
}

const undefinedFn = () => undefined

const invalidFn = 123

const errFn = () => {
  throw new Error('This is an error')
}

const identity = x => x

tests.forEach(x => {
  let removes = []

  if (x.disabled) {
    return
  }

  it(x.comment, () => {
    let db = dbFn(x.doc)
    let fn = jest.fn()

    let ys = Object.keys(x.dynamic)
    let initial = db.get('/')

    let before = db.get('/err/node')
    ys.forEach(y => {
      let fn
      if (x.undefinedFn) {
        fn = undefinedFn
      } else if (x.errFn) {
        fn = errFn
      } else if (x.invalidFn) {
        fn = invalidFn
      } else if (x.dynamic[y].length === 1) {
        fn = identity
      } else {
        fn = concat
      }

      removes.push(db.node(y, x.dynamic[y], fn))

      if (x.overwrite) {
        removes.push(db.node(y, x.dynamic[y], fn))
      }

    })

    let after = db.get('/err/node')

    if (x.error) {
      expect(after.length).toBeGreaterThan(0)
    } else {
      expect(after.length).toBe(0)
      ys.forEach(y => {
        expect(db.has(y)).toBe(true)
      })
    }

    if (x.remove) {
      // Trigger cache
      db.get('/')
      ys.forEach(y => {
        db.get(y)
        decomposePath(y).forEach(x => {
          db.get(x)
        })
      })

      removes.forEach(x => {
        x()
      })

      ys.forEach(y => {
        expect(db.has(y)).toBe(false)
        expect(db.get(y)).toBe(undefined)

        let parents = decomposePath(y)
        parents.forEach(x => {
          let val = initial
          let xs = splitPath(x)
          while (xs.length > 0) {
            val = val[xs.shift()]
          }
          expect(db.get(x)).toEqual(val)
        })
      })

      expect(db.get('/')).toEqual(initial)
    }

  })

})
