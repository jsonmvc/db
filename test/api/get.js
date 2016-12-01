'use strict'

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/api/get.yml`, 'utf-8')
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
        let len = x.dynamic[y].length
        let toCall

        if (x.undefinedFn) {
          toCall = undefinedFn
        } else if (x.errFn) {
          toCall = errFn
        }

        if (len === 1) {
          fn = x => toCall ? toCall() : x
        } else if (len === 2) {
          fn = (x, y) => toCall ? toCall() : `${x}-${y}`
        } else if (len === 3) {
          fn = (x, y, z) => toCall ? toCall() : `${x}-${y}-${z}`
        } else if (len === 4) {
          fn = (x, y, z, t) => toCall ? toCall() : `${x}-${y}-${z}-${t}`
        }

        db.node(y, x.dynamic[y], fn)
      })
    }

    if (x.get === "undefined" ) {
      x.get = undefined
    }

    let val = db.get(x.get)

    if (x.errFn) {
      expect(db.get('/err/node').length).toBe(1)
    }

    if (x.reference) {
      let before = db.get(x.get + '/' + x.reference)
      val[x.reference] = 'something else'
      let after = db.get(x.get + '/' + x.reference)
      expect(after).toEqual(before)
    } else {
      let val = db.get(x.get)

      if (val === undefined && x.expect === "undefined") {
        val = "undefined"
      }

      expect(val).toEqual(x.expect)
    }


  })

})
