'use strict'
const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/fn/isValidValue.yml`, 'utf-8')

const tests = require('yaml-js').load(testsFile)
const isValidValue = require(`${root}/src/fn/isValidValue`)

tests.forEach(x => {

  it(x.comment, () => {
    let val = x.value

    if (x.function) {
      val = function () {}
    } else if (x.regex) {
      val = /123/
    }

    expect(isValidValue(val)).toBe(x.expected)
  })

})
