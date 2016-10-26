const detector = require('./detector')
const handlers = {
  'jpg': require('./jpg'),
  'png': require('./png')
}

function lookup (typedArray) {
  const type = detector(typedArray)

  return type
    ? handlers[type].calculate(typedArray)
    : null
}

module.exports = lookup
