
function getStaticDeps(paths, deps) {
  let staticDeps = deps.slice()

  paths.forEach(x => {
    staticDeps = staticDeps.filter(y => x !== y)
  })

  return staticDeps
}

module.exports = getStaticDeps
