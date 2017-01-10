'use strict'

let isDebug = false

if (
  process && process.env && process.env.JSONMVC === 'debug'
  || typeof JSONMVC_ENV !== 'undefined' && JSONMVC_ENV === 'debug'
) {
  isDebug = true
}

module.exports = isDebug
