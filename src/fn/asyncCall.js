
module.exports = (fn, arg) => {
  process.nextTick(() => fn.call(null, arg))
}
