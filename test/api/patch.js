'use strict'

const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/api/patch.yml`, 'utf-8')
const tests = require('yaml-js').load(testsFile)
const dbFn = require(`${root}/src/index`)

tests.forEach(x => {

  if (x.disabled) {
    return
  }

  if (x.expected) {
    it('should succeed: ' + x.comment, () => {
      let db = dbFn(x.doc)
      let result = db.patch(x.patch)

      x.expected.err = db.get('/err')
      expect(db.get('/')).toEqual(x.expected)
    })
  } else if (x.error) {
    it('should fail: ' + x.comment, () => {
      let db = dbFn(x.doc)
      let before = db.get('/err/patch')

      if (x.valueFn) {
        x.patch[0].value = function () {}
      } else if (x.circular) {
        var a = {}
        var b = {}
        a.b = b
        b.a = a
        x.patch[0].value = a
      } else if (x.nonValidJson) {
        x.patch[0].value = /123/
      }

      db.patch(x.patch)

      let after = db.get('/err/patch')

      expect(after.length).toBe(before.length + 1)
    })
  }

})
