'use strict'
const root = process.cwd()
const fs = require('fs')
const testsFile = fs.readFileSync(`${root}/test/fn/cacheInvalidation.yml`, 'utf-8')
const uniq = require('lodash/uniq')

const tests = require('yaml-js').load(testsFile)
const splitPath = require(`${root}/src/fn/splitPath`)
const decomposePath = require(`${root}/src/fn/decomposePath`)


let cache = {
  paths: {},
  tree: {}
}


// Differentiate static nodes from dynamic nodes
// When patching save all the paths that were affected
// including those inside that provided path. Eg:
//
// { op: 'add', path: '/foo/bar', value: { a: { b: 123 } } }
//
// This will return an affected array of:
// /foo/bar/a/b
//
// From this generate:
// /foo
// /foo/bar
// /foo/bar/a
// /foo/bar/a/b
//
// Then find from all the dynamic nodes that listen to static
// changes which one has the exact path of one of these.
//
// Then for each of those dynamic nodes get all the other dynamic
// nodes that they affect recursively
//

function getFullDeps(nodes, path) {
  let node = nodes[path]

  if (!node) {
    return []
  }

  let deps = []
  let paths = Object.keys(nodes)

  for (let j = 0; j < node.deps.length; j += 1) {
    let dep = node.deps[j]
    let reg = new RegExp('^' + dep)
    let parts = decomposePath(dep)
    let selected = false

    // Add all dynamic nodes
    for (let k = 0; k < paths.length; k += 1) {
      let cur = paths[k]
      if (parts.indexOf(cur) !== -1 || cur.match(reg) !== null) {
        selected = true
        deps.push(cur)
        deps = deps.concat(getFullDeps(nodes, cur))
      }
    }

    // Add static nodes
    if (selected === false) {
      deps.push(dep)
    }
  }

  return deps
}

function parseNodes(nodes) {

  let paths = Object.keys(nodes)

  for (let i = 0; i < paths.length; i += 1) {
    let path = paths[i]
    let deps = uniq(getFullDeps(nodes, path))
    nodes[path].fullDeps = deps
  }

  return nodes

}

function cacheInvalidation(db, changed) {
  let indirect = []
  let direct = []

  let nodePaths = Object.keys(db.nodes)

  changed.forEach(x => {
    let paths = decomposePath(x)

    direct.push(x)
    indirect = indirect.concat(paths)
    nodePaths.forEach(y => {
      let node = db.nodes[y]

      node.fullDeps.forEach(z => {
        if (direct.indexOf(z) && direct.indexOf(y) === -1) {
          direct.push(y)
          indirect = indirect.concat(decomposePath(y))
        }
      })
    })
  })

  direct = uniq(direct)
  indirect = uniq(indirect)

  return {
    direct,
    indirect
  }
}

function cachePath(db, path, value) {
  let parts = splitPath(path)

  // If there's a dynamic path of some sort here
  // then store it somehow so that it can be
  // recognized
  // else just store it plain
  // - move the responsability to the patching
  // system to give all the paths that have
  // been changed

  db.cache.paths[path] = value
  parts.forEach(x => {
    db.tree[x]
  })
}

tests.forEach(x => {

  it(x.comment, () => {

    let db = {}
    db.nodes = parseNodes(x.nodes)
    db.cache = {
      paths: {},
      tree: {}
    }
    x.cache.forEach(y => {
      cachePath(db, y, {})
    })

    let result = cacheInvalidation(db, x.changed)

    console.log(result)
    // expect(cacheInvalidation(db, x.cache, x.changed)).toEqual(expect.arrayContaining(x.expect))
  })

})

// Nodes represent cached values
