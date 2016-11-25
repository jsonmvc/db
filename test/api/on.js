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

tests.forEach(x => {

  if (x.disabled) {
    return
  }

  it(x.comment, () => {
    let db = dbFn(x.doc)
    let fn = jest.fn()

    if (x.dynamic) {
      x.dynamic.forEach(y => {
        db.node(x[0], x[1], concat)
      })
    }

    x.listeners.forEach(y => {
      db.on(y, x => {
        fn(x, db.get(y))
      })
    })

    db.patch(x.patch)

    return delayed(() => {
      console.log(fn.mock.calls)
      fn.mock.calls.forEach(x => {
        expect(x[0]).toEqual(x[1])
      })

      expect(fn.mock.calls.length).toBe(x.listeners.length)
    })

  })

})
