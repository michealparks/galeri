import {ipcMain as ipc, nativeImage} from 'electron'
import {getNextArtwork} from './museums'
import {sendArtToWindows} from './events'
import {changeWallpaper} from './image/change-wallpaper'
import {getScreenSize} from '../util'
import {appConfigPath} from '../shared/app-config-path'
import {deleteDir, makeDir, downloadFile} from '../util/file'

const imgPath = appConfigPath('Galeri Images')

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
    // TODO
  })

  cycle()
}

const fileify = (str) => {
  return str.toLowerCase().replace(/\s/g, '_')
}

const cycle = async () => {
  if (__dev__) console.log('cycle()')

  const delErr = await deleteDir(imgPath)

  if (delErr !== undefined) {
    console.log(delErr)
  }

  const dirErr = await makeDir(imgPath)

  if (dirErr !== undefined) {
    console.log(dirErr)
    return cycle()
  }

  const art = await getNextArtwork()

  if (art === undefined) return cycle()

  const filename = `${fileify(art.source)}_${fileify(art.title)}${art.ext}`
  const filepath = `${imgPath}/${filename}`

  const fileErr = await downloadFile(art.img, filepath)

  if (fileErr !== undefined) {
    console.log(fileErr)
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

  const menuSuccess = await sendArtToWindows(art)

  if (menuSuccess === false) return cycle()

  const desktopSuccess = await changeWallpaper(imgPath, filename)

  if (desktopSuccess === undefined) return cycle()

  cycleID = setTimeout(cycle, 1000 * 30)
}
