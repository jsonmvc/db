module.exports = function isValidValue(value) {
  return value !== undefined
    && (
      value === null ||
      value.constructor === Boolean ||
      value.constructor === String ||
      value.constructor === Number ||
      value.constructor === Array ||
      value.constructor === Object
    )
}
