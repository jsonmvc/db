'use strict'
const get = require('./getValue')

module.exports = function errPatch(db, path, obj) {
  const patch = require('./../api/patch')
  var err = get(db.static, path)

  ;(function () {
    try {
      err.value = JSON.parse(JSON.stringify(obj))
    } catch(e) {
      err.value = '[ERROR] ' + e.message
    }
  }())

  err.id = path

  patch(db)([{
    op: 'add',
    path: `/err/${err.name}/-`,
    value: err
  }])

}
