import detector from './detector'
import {isJPG, isPNG} from './calculator'
import {screenWidth, screenHeight} from '../screen'
import timeout from '../timeout'

const fetchArt = async (url) => {
  let res

  try {
    res = await Promise.race([timeout(7000), fetch(url)])
  } catch (err) {
    onError(err)
  }

  return res
}

export default async (art) => {
  if (__dev__) console.log('getDimensions()')
  const res = await fetchArt(art.img)

  if (res === null || res === undefined || res.status !== 200) {
    if (__dev__) console.warn('error validating image:', 'status 404')

    const result = await loadEntireImg(art)

    return result
  }

  const reader = res.body.getReader()

  let count = 0
  let buffer = new Uint8Array()

  while (count++ < 4) {
    const {value, done} = await reader.read()

    if (value === null || value === undefined) {
      break
    }

    const newBuf = new Uint8Array(buffer.length + value.length)
    newBuf.set(buffer, 0)
    newBuf.set(value, buffer.length)
    buffer = newBuf

    const type = detector(buffer)

    // No supported format was found.
    if (done && type === undefined) {
      reader.cancel()
      onError('no image format found')
      return
    }

    // No format has been found... yet.
    if (type === undefined) continue

    // Attempt to extract data
    const data = type === 'png' ? isPNG(value) : isJPG(value)

    // No dimensional data could be found
    if (done && data === undefined) {
      reader.cancel()
      onError('no dimensions found')
      return
    }

    // No data has been found... yet.
    if (data === undefined) continue

    // Data has been found, so close the stream.
    reader.cancel('No more reading needed.')

    // Check if the dimensions are satisfactory.
    if (data.width < screenWidth() || data.height < screenHeight()) {
      onError(`Image dimensions are too small: ${data.width}x${data.height}`)
      return
    }

    art.naturalWidth = data.width
    art.naturalHeight = data.height

    return art
  }

  reader.cancel('No metadata found.')

  const result = await loadEntireImg(art)

  return result
}

const loadEntireImg = (art) => new Promise(resolve => {
  if (__dev__) console.log('loadEntireImg()')
  const img = document.createElement('img')

  img.onload = () => {
    art.naturalWidth = img.naturalWidth
    art.naturalHeight = img.naturalHeight

    if (art.naturalWidth < screenWidth() ||
        art.naturalHeight < screenHeight()) {
      onError(`error validating image (size): ${art.naturalWidth}x${art.naturalHeight}`)
      return resolve()
    }

    resolve(art)
  }

  img.onerror = (err) => {
    if (__dev__) console.warn('error validating image:', err)
    resolve()
  }

  img.src = art.img
})

const onError = (err) => {
  if (__dev__) console.warn('error validating image:', err)
}
