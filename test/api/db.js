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
    let err

    try {
      db = dbFn(x.doc)
    } catch (e) {
      err = e
    }

    if (x.error) {
      expect(err).toBeDefined()
    } else {
      expect(db.get('/')).toEqual(x.expected)
    }
  })

})
