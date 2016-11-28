'use strict'

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/db.yml`, 'utf-8')
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
    let db

    db = dbFn(x.doc)

    if (x.error) {
      let path = db.get(`${x.error}/path`)
      let err = db.get(path)

      expect(err.length).toBe(1)
    } else {
      expect(db.get('/')).toEqual(x.expected)
    }
  })

})
