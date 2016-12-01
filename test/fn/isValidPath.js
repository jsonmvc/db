'use strict'
const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/fn/isValidPath.yml`, 'utf-8')

const tests = require('yaml-js').load(testsFile)
const isValidPath = require(`${root}/src/fn/isValidPath`)

tests.forEach(x => {

  it(x.comment, () => {
    let val = x.value

    if (x.function) {
      val = function () {}
    } else if (x.regex) {
      val = /123/
    }

    expect(isValidPath(val)).toBe(x.expected)
  })

})
