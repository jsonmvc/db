'use strict'
const Benchmark = require('benchmark');
const suite = new Benchmark.Suite


let str = '/qwe/rtyuio/pasdfgh/jklzxcvb/nm1234/567890'
let arr = []
suite.add('String split', {
  fn: function() {
    arr = str.split('/')
  }
})
.add('With array', {
  fn: function () {
    let initialLen = str.length
    let len = initialLen
    let index = 0
    let charAt
    let word = ''
    while (len--) {
      charAt = str[len]
      if (charAt === '/') {
        arr[index] = word
        index += 1
      } else {
        word = word + charAt
      }
    }
  }
})
.on('start', x => {
  console.log('Started benchmark...')
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
})
.run({ 'async': true });

