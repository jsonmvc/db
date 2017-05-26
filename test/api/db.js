'use strict'

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/api/db.yml`, 'utf-8')
const tests = require('yaml-js').load(testsFile)
const dbFn = require(`${root}/dist/jsonmvcdb`)

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
    let db

    db = dbFn(x.doc)

    if (x.error) {
      let name = db.get(`${x.error}/name`)

      let err = db.get(`/err/${name}`)

      expect(err.length).toBe(1)
      expect(err[0].id).toBe(x.error)
    } else {
      expect(db.get('/')).toEqual(x.expected)
    }
  })

})
