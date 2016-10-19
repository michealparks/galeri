function clamp (val, min, max) {
  return Math.max(min, Math.min(max, val))
}

module.exports = { clamp }
