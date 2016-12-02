'use strict'
const get = require('./getValue')

module.exports = function errPatch(db, path, obj) {
  const patch = require('./../api/patch')
  var err = get(db.static, path)

  err.value = obj
  err.id = path

  patch(db)([{
    op: 'add',
    path: `/err/${err.name}/-`,
    value: err
  }])

}
