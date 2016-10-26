const pngSignature = 'PNG\r\n\x1a\n'

function isPNG (buffer) {
  if (buffer.toString('ascii', 1, 8) === pngSignature) {
    if (buffer.toString('ascii', 12, 16) !== 'IDHR') {
      return false
    }
    return true
  }

  return false
}

function calculate (buffer) {
  return {
    'width': buffer.readUInt32BE(16),
    'height': buffer.readUInt32BE(20)
  }
}

module.exports = { isPNG, calculate }
