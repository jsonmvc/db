'use strict'
const splitPath = require('./splitPath')
const decomposePath = require('./decomposePath')

function allPaths(tree, path) {
  let paths = []
  let currentPath = ''
  let ref = tree

  splitPath(path).forEach(x => {
    currentPath += '/' + x
    paths.push(currentPath)

    if (ref[x] && ref[x].children) {
      ref = ref[x].children
    }
  })

  paths = paths.concat(childPaths(ref))

  return paths
}

function childPaths(ref, paths) {
  if (!paths) {
    paths = []
  }

  Object.keys(ref).forEach(x => {
    paths.push(ref[x].path)
    childPaths(ref[x].children, paths)
  })

  return paths
}

function affectedNodes(db, path, nodes) {
  let deps = db.dynamic.fullDeps

  if (!nodes) {
    nodes = []
  }

  if (!deps) {
    return nodes
  }

  Object.keys(deps).forEach(x => {
    let depList = deps[x]

    depList.forEach(y => {
      let reg = new RegExp('^' + y)
      if (reg.test(path) !== null && nodes.indexOf(x) === -1) {
        nodes.push(x)
        affectedNodes(db, x, nodes)
      }
    })
  })

  return nodes
}

function invalidateCache(db, changed) {

  changed.full.forEach(x => {

    let affected = affectedNodes(db, x)
    affected.push(x)

    let result = affected.reduce((acc, y) => {
      acc = acc.concat(allPaths(db.cache.tree, y))
      return acc
    }, [])

    result.forEach(x => {
      delete db.cache.paths[x]
    })

  })

  delete db.cache.paths['/']

}

module.exports = invalidateCache
