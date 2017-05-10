module.exports = {jpg, png}

function jpg (buffer) {
  // Skip 5 chars, they are for signature
  let buf = buffer.subarray(4, buffer.length - 1)

  let i, next
  while (buf.length) {
    i = readUInt16BE(buf, 0)

    // 0xFFC0 is baseline(SOF)
    // 0xFFC2 is progressive(SOF2)
    next = buf[i + 1]
    if (next === 0xC0 || next === 0xC2) {
      return {
        width: readUInt16BE(buf, i + 7),
        height: readUInt16BE(buf, i + 5)
      }
    }

    // move to the next block
    buf = buf.subarray(i + 2, buf.length - 1)
  }
}

function png (buffer) {
  return {
    width: readUInt32BE(buffer, 16),
    height: readUInt32BE(buffer, 20)
  }
}

function readUInt16BE (arr, offset) {
  offset = offset >>> 0
  return (arr[offset] << 8) | arr[offset + 1]
}

function readUInt32BE (arr, offset) {
  offset = offset >>> 0

  return (arr[offset] * 0x1000000) +
    ((arr[offset + 1] << 16) |
    (arr[offset + 2] << 8) |
    arr[offset + 3])
}
