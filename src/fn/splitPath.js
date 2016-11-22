
module.exports = path => {
  path = path.replace(/~0/g, '~')
  path = path.replace(/~1/g, '/')
  path = path.split('/')
  path.shift()

  return path
}

