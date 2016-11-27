'use strict'

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/on.yml`, 'utf-8')
const tests = require('yaml-js').load(testsFile)
const dbFn = require(`${root}/src/index`)
const Promise = require('promise')
const asyncCall = require(`${root}/src/fn/asyncCall.js`)

const delayed = fn => {
  return new Promise((resolve) => {
    asyncCall(() => {
      resolve(fn())
    })
  })
}

const concat = function () {
  return Array.prototype.join.call(arguments, '-')
}

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
        if (x.dynamic[y].length === 1) {
          fn = identity
        } else {
          fn = concat
        }
        db.node(y, x.dynamic[y], fn)
      })
    }

    x.listeners.forEach(y => {
      db.on(y, x => {
        fn(x, db.get(y))
      })
    })

    db.patch(x.patch)

    return delayed(() => {
      fn.mock.calls.forEach(x => {
        expect(x[0]).toEqual(x[1])
      })
      expect(fn.mock.calls.length).toBe(x.listeners.length)
    })

  })

})
