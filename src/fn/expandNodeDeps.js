'use strict'
const getStaticDeps = require('./getStaticDeps')
const getFullDeps = require('./getFullDeps')
const uniq = require('lodash/uniq')

function expandNodeDeps(dynamic) {

  let paths = Object.keys(dynamic.deps)

  dynamic.fullDeps = {}
  dynamic.staticDeps = {}

  for (let i = 0; i < paths.length; i += 1) {
    let path = paths[i]
    let deps = uniq(getFullDeps(dynamic.deps, path))
    dynamic.fullDeps[path] = deps
    dynamic.staticDeps[path] = getStaticDeps(paths, deps)
  }

}

module.exports = expandNodeDeps
