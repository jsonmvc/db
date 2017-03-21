'use strict'

module.exports = function decomposePath(path) {
  let xs = []

  let x = path.slice(0, path.lastIndexOf('/'))
  while(x !== '') {
    xs.push({
      value: x,
      belongsTo: path
    })
    x = x.slice(0, x.lastIndexOf('/'))
  }

  return xs
}

