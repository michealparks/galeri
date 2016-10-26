function isJPG (buffer) {
  return buffer.toString('hex', 0, 2) === 'ffd8'
}

function extractSize (buffer, i) {
  return {
    'height': buffer.readUInt16BE(i),
    'width': buffer.readUInt16BE(i + 2)
  }
}

function calculate (buffer) {
  // Skip 5 chars, they are for signature
  buffer = buffer.slice(4)

  let i, next
  while (buffer.length) {
    i = buffer.readUInt16BE(0)

    // 0xFFC0 is baseline(SOF)
    // 0xFFC2 is progressive(SOF2)
    next = buffer[i + 1]
    if (next === 0xC0 || next === 0xC2) {
      return extractSize(buffer, i + 5)
    }

    // move to the next block
    buffer = buffer.slice(i + 2)
  }
}

module.exports = { isJPG, calculate }
