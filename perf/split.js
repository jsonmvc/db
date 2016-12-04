'use strict'
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite
const jsonpatch = require('fast-json-patch')

const path = '/foo/bar/baz/qux'
let last

suite.add('Split', {
  fn: function() {
    let pathParts = path.split('/')
    last = pathParts[pathParts.length - 1]
  }
})
.add('Slice', {
  fn: function () {
    last = path.slice(path.lastIndexOf('/') + 1)
  }
})
.add('While', {
  fn: function () {
    let len = path.length - 1
    while (path[len] !== '/') {
      last = path[len] + last
      len -= 1
    }
  }
})
.on('start', x => {
  console.log('Started benchmark...')
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({ 'async': true });

