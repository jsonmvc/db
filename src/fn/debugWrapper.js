'use strict'

let present = require('present')

function debugWrapper(name, fn, paramNo) {
  let debug = paramNo ? {} : []

  if (typeof window !== 'undefined') {
    window.JSONMVC_DEBUG[name] = debug
  }

  function jsonmvc_debug_wrapper() {
    let args = Array.prototype.slice.apply(arguments)
    let start = present()
    let result = fn.apply(null, args)
    let end = present()
    let dur = end - start

    if (paramNo) {
      if (!debug[args[paramNo]]) {
        debug[args[paramNo]] = []
      }
      debug[args[paramNo]].push(dur)
    } else {
      debug.push(dur)
    }

    return result
  }

  return jsonmvc_debug_wrapper
}

module.exports = debugWrapper
