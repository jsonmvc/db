'use strict'

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/api/has.yml`, 'utf-8')
const tests = require('yaml-js').load(testsFile)
const dbFn = require(`${root}/src/index`)

const concat = function () {
  return Array.prototype.join.call(arguments, '-')
}

const undefinedFn = () => undefined
const errFn = () => {
  throw new Error('This is an error')
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
        if (x.undefinedFn) {
          fn = undefinedFn
        } else if (x.errFn) {
          fn = errFn
        } else if (x.dynamic[y].length === 1) {
          fn = identity
        } else {
          fn = concat
        }
        db.node(y, x.dynamic[y], fn)
      })
    }

    let val = db.has(x.get)

    expect(val).toBe(x.expect)

  })

})
