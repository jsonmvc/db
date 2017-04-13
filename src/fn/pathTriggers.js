const flatten = require('lodash/flattenDeep')
const uniq = require('uniq')
const decomposePath = require('./../fn/decomposePath')

module.exports = function pathTriggers(db, path) {
  let trigger = []

  let parts = decomposePath(path)
  parts.push(path)

  parts.forEach(y => {
    if (db.updates.triggers[y]) {
      trigger.push(db.updates.triggers[y])
    }
  })

  // @TODO: Suboptimal way, this should be precompiled
  let reg = new RegExp('^' +path, 'g')

  Object.keys(db.updates.triggers).forEach(x => {
    if (x.search(reg) !== -1) {
      trigger.push(db.updates.triggers[x])
    }
  })

  let dep = db.dynamic.inverseDeps[path]

  if (dep) {
    trigger = trigger.concat(dep)
  }

  trigger = flatten(trigger)

  trigger.push(path)

  trigger = uniq(trigger)

  return trigger
}
