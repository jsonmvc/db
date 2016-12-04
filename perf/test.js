'use strict'
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite
const jsonpatch = require('fast-json-patch')
const sample = require('./sample.json')

const dbFn = require('./../src/index.js')

const patch = [{
  op: 'add',
  path: '/foo/bar',
  value: sample
}]
;

const patches = [{
  "op": "add",
  "path": "/baz/0/qux",
  "value": "world"
}];

const dbPatch = dbFn({
  "foo": 1,
  "baz": [{
    "qux": "hello"
  }]
})


const dbJson = dbFn({
  "foo": 1,
  "baz": [{
    "qux": "hello"
  }]
})

suite.add('DB patch test', {
  fn: function() {
    dbPatch.patch(patches, false, false)
  }
})
.add('Fast-Json-Patch patch test', {
  fn: function () {
    jsonpatch.apply(dbJson.db.static, patches)
  }
})
.on('start', x => {
  console.log('Started benchmark...')
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.run({ 'async': true });

