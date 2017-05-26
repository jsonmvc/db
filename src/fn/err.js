
import get from './getValue'

function errPatch(db, path, obj) {
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

export default errPatch
