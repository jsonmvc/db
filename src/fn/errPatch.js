'use strict'
const get = require('./getValue')
const patch = require('./../api/patch')

module.exports = function errPatch(db, path, obj) {
  let err = get(db.static, path)

  err.value = obj.value
  err.id = path

  patch(db)({
    op: 'add',
    path: `/err/${err.name}/-`,
    value: err
  })

}
