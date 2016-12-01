'use strict'

jest.useFakeTimers()

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/api/on.yml`, 'utf-8')
let tests = require('yaml-js').load(testsFile)
const dbFn = require(`${root}/src/index`)
const Promise = require('promise')

require('setimmediate')

const delayed = fn => {
  return new Promise((resolve) => {
    setImmediate(() => {
      resolve(fn())
    })
  })
}

const undefinedFn = x => undefined
const errFn = x => {
  throw new Error('This is an error')
}
const noArgsFn = () => undefined

const identity = x => x


tests.forEach(x => {

  if (x.disabled) {
    return
  }

  it(x.comment, () => {
    let db = dbFn(x.doc)
    let fn = jest.fn()

    if (x.dynamic) {
      let ys = Object.keys(x.dynamic)
      ys.forEach((y, i) => {
        let fn
        let len = x.dynamic[y].length

        if (len === 1) {
          fn = x => x
        } else if (len === 2) {
          fn = (x, y) => `${x}-${y}`
        } else if (len === 3) {
          fn = (x, y, z) => `${x}-${y}-${z}`
        } else if (len === 4) {
          fn = (x, y, z, t) => `${x}-${y}-${z}-${t}`
        }

        db.node(y, x.dynamic[y], fn)
      })
    }

    x.listeners.forEach(y => {
      if (x.errFn) {
        db.on(y, errFn)
      } else if (x.invalidFn) {
        db.on(y, 123)
      } else if (x.noArgsFn) {
        db.on(y, noArgsFn)
      } else {
        db.on(y, x => {
          fn(x, db.get(y), y)
        })
      }
    })

    if (x.patch) {
      if (x.async) {
        x.patch.forEach((x, i) => {
          setTimeout(() => {
            db.patch(x)
          }, i * 10)
        })
      } else {
        db.patch(x.patch)
      }
    }

    jest.runAllTimers()

    return delayed(() => {
      if (x.errFn || x.invalidFn || x.noArgsFn) {
        expect(db.get('/err/on').length).toBe(1)
      } else {
        fn.mock.calls.forEach(x => {
          expect(x[0]).toEqual(x[1])
        })
        if (x.async) {
          let result = fn.mock.calls.reduce((acc, x) => {
            acc[x[2]] = x[0]
            return acc
          }, {})

          Object.keys(result).forEach(x => {
            expect(result[x]).toEqual(db.get(x))
          })

        } else {
          expect(fn.mock.calls.length).toBe(x.listeners.length)
        }
      }
    })
  })

})
