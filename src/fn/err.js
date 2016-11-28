'use strict'
const get = require('./getValue')
const patch = require('./../api/patch')

module.exports = function errPatch(db, path, obj) {
  let err = get(db.static, path)

  err.value = obj
  err.id = path
  err.stack = new Error().stack

  patch(db)({
    op: 'add',
    path: `/err/${err.name}/-`,
    value: err
  })

}
