const isCyclic = require('./../../src/fn/isCyclic')

const d = {
  '/a/b/c': ['/b/c', '/d'],
  '/b/c': ['/g'],
  '/d/f/g': ['/m/a'],
  '/m/a': ['/a']
}

console.log('Is cyclic', isCyclic(d))
