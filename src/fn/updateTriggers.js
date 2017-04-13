
const getStaticNodes = require('./../fn/getStaticNodes')
const decomposePath = require('./../fn/decomposePath')

module.exports = (db, path) => {

  let parts = decomposePath(path)
  let nodes = getStaticNodes(db, path)

  parts.forEach(x => {
    if (db.dynamic.fns[x]) {
      let n = getStaticNodes(db, x)
      nodes = nodes.concat(n)
    }
  })

  nodes.forEach(x => {
    if (!db.updates.triggers[x]) {
      db.updates.triggers[x] = [path]
    } else if (db.updates.triggers[x].indexOf(path) === -1) {
      db.updates.triggers[x].push(path)
    }
  })

  parts.forEach(y => {
    if (!db.updates.triggers[y]) {
      db.updates.triggers[y] = [path]
    } else if (db.updates.triggers[y].indexOf(path) === -1) {
      db.updates.triggers[y].push(path)
    }
  })

}
