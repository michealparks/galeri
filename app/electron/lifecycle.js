import {ipcMain as ipc, nativeImage} from 'electron'
import {unlink} from 'fs'
import {getNextArtwork} from './museums'
import {downloadImage} from './image'
import {sendArtToWindows} from './events'
import {getScreenSize} from './museums/util'

let cycleID, cleanID

export const initLifecycle = (powerMonitor) => {
  if (__dev__) console.log('initLifecycle()')

  powerMonitor.on('suspend', () => {
    clearTimeout(cycleID)
    clearTimeout(cleanID)
  })

  powerMonitor.on('resume', () => {
    cycle()
  })

  powerMonitor.on('shutdown', () => {

  })

  cycle()
}

const cycle = async () => {
  if (__dev__) console.log('cycle()')

  const art = await getNextArtwork()

  if (art === undefined) return cycle()

  const [err, filepath] = await downloadImage(art)

  if (err !== undefined) {
    console.log(err)
    return cycle()
  }

  const img = nativeImage.createFromPath(filepath)
  const imgSize = img.getSize()
  const screenSize = getScreenSize()

  if (imgSize.width < screenSize.width ||
      imgSize.height < screenSize.height) {
    return cycle()
  }

  art.filepath = filepath

  const success = await sendArtToWindows(art)

  if (success === false) return cycle()

  cycleID = setTimeout(cycle, 1000 * 30)
  cleanID = setTimeout(cleanupImageFile, 1000 * 60, filepath)
}

const cleanupImageFile = (filepath) => {
  unlink(filepath, (err) => {
    if (err) console.error(err)
  })
}
