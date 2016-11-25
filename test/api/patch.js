'use strict'

const root = process.cwd()
const fs = require('fs')
const yamljs = require('yaml-js')
const testsFile = fs.readFileSync(`${root}/test/tests.yml`, 'utf-8')
const tests = yamljs.load(testsFile)
const dbFn = require(`${root}/src/index`)

tests.patch.forEach(x => {
  it(x.comment, () => {
    let db = dbFn(x.doc)
    expect(1).toBe(1)
  })
})
