const isJPG = (buffer) => {
  return hexSlice(buffer, 0, 2) === 'ffd8'
}

const isPNG = (buffer) => {
  if (asciiSlice(buffer, 1, 8) !== 'PNG\r\n\x1a\n' ||
      asciiSlice(buffer, 12, 16) !== 'IHDR') return false

  return true
}

const hexSlice = (b, start, end) => {
  let out = ''
  for (let n, i = start, l = Math.min(b.length, end); i < l; ++i) {
    n = b[i]
    out += ((n < 16 ? '0' : '') + n.toString(16)) // <- toHex
  }
  return out
}

const asciiSlice = (b, start, end) => {
  let ret = ''
  for (let i = start, l = Math.min(b.length, end); i < l; ++i) {
    ret += String.fromCharCode(b[i] & 0x7F)
  }
  return ret
}

export default (buffer) => {
  if (isJPG(buffer)) return 'jpg'
  if (isPNG(buffer)) return 'png'
}
