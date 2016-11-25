'use strict'

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/patch.yml`, 'utf-8')
const tests = require('yaml-js').load(testsFile)
const dbFn = require(`${root}/src/index`)

tests.forEach(x => {

  if (x.disabled) {
    return
  }

  if (x.expected) {
    it('should succeed: ' + x.comment, () => {
      let db = dbFn(x.doc)
      db.patch(x.patch)
      expect(db.get('/')).toEqual(x.expected)
    })
  } else if (x.error) {
    it('should fail: ' + x.comment, () => {
      let db = dbFn(x.doc)
      let err
      let threw = false
      try {
        db.patch(x.patch)
      } catch (e) {
        err = e
        threw = true
      }

      if (!err) {
        console.log(x)
      }

      expect(threw).toBe(true)
    })
  }

})
