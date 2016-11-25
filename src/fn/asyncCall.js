
module.exports = (fn, arg) => {
  if (setImmediate) {
    setImmediate(() => fn.call(null, arg))
  } else if (requestAnimationFrame) {
    requestAnimationFrame(() => fn.call(null, arg))
  } else {
    setTimeout(() => fn.call(null, args), 0)
  }
}
