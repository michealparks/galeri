import {unlink} from 'fs'
import {getNextArtwork} from './museums'
import {downloadImage} from './image'
import {sendArtToWindows} from './events'

export const initLifecycle = async () => {
  if (__dev__) console.log('initLifecycle()')

  const art = await getNextArtwork()

  if (art === undefined) return initLifecycle()

  const [err, filepath] = await downloadImage(art)

  if (err !== undefined) {
    console.log(err)
    return initLifecycle()
  }

  art.filepath = filepath

  sendArtToWindows(art)

  setTimeout(initLifecycle, 1000 * 30)
  setTimeout(cleanupImageFile, 1000 * 60, filepath)
}

const cleanupImageFile = (filepath) => {
  unlink(filepath, (err) => {
    if (err) console.error(err)
  })
}
