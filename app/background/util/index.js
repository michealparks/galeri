module.exports = {isNullUndefined, clamp}

function isNullUndefined (val) {
  return val === null || val === undefined
}

function clamp (n, min, max) {
  return Math.min(Math.max(n, min), max)
}
