'use strict'
const getFullDeps = require('./getFullDeps')
const decomposePath = require('./decomposePath')
const uniq = require('lodash/uniq')

function expandNodeDeps(dynamic) {

  let paths

  paths = Object.keys(dynamic.deps)
  dynamic.fullDeps = {}

  for (let i = 0; i < paths.length; i += 1) {
    let path = paths[i]
    let deps = uniq(getFullDeps(dynamic.deps, path))
    dynamic.fullDeps[path] = deps
    dynamic.decomposed[path] = decomposePath(path)
  }

  paths = Object.keys(dynamic.fullDeps)
  dynamic.staticDeps = {}

  for (let i = 0; i < paths.length; i += 1) {
    let path = paths[i]
    let deps = dynamic.fullDeps[path]

    deps.forEach(x => {
      if (!dynamic.fullDeps[x]) {
        if (!dynamic.staticDeps[x]) {
          dynamic.staticDeps[x] = []
        }
        dynamic.staticDeps[x].push(path)
      }
    })
  }

}

module.exports = expandNodeDeps
