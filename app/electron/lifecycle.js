import {ipcMain as ipc, nativeImage} from 'electron'
import {resolve} from 'path'
import {getNextArtwork} from './museums'
import {sendArtToWindows} from './events'
import {state} from './state'
import {changeWallpaper} from './image/change-wallpaper'
import {getScreenSize} from '../util'
import {appConfigPath} from '../shared/app-config-path'
import {deleteDir, makeDir, downloadFile, copyFile} from '../util/file'

const imgPath = appConfigPath('Galeri Images')

let cycleID

ipc.on('pause', (e, isPaused) => {
  state.isPaused = isPaused
  clearTimeout(cycleID)
})

export const initLifecycle = (powerMonitor) => {
  if (__dev__) console.log('initLifecycle()')

  powerMonitor.on('suspend', () => {
    clearTimeout(cycleID)
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

  const art = await getNextArtwork()

  if (art === undefined) return cycle()

  await deleteDir(state.wallpaperDir)
  await deleteDir(state.pendingDir)
  await makeDir(state.wallpaperDir)
  await makeDir(state.pendingDir)

  const filename = `${fileify(art.source)}_${fileify(art.title)}${art.ext}`
  const pendingPath = resolve(state.pendingDir, filename)
  const imgPath = resolve(state.wallpaperDir, filename)

  const fileErr = await downloadFile(art.img, pendingPath)

  if (fileErr !== undefined) {
    console.log(fileErr)
    return cycle()
  }

  const img = nativeImage.createFromPath(pendingPath)
  const imgSize = img.getSize()
  const screenSize = getScreenSize()

  if (imgSize.width < screenSize.width ||
      imgSize.height < screenSize.height) {
    return cycle()
  }

  const copyErr = await copyFile(pendingPath, imgPath)

  if (copyErr) {
    console.error(copyErr)
    return cycle()
  }

  art.filepath = imgPath

  const menuSuccess = await sendArtToWindows(art)

  if (menuSuccess === false) return cycle()

  const desktopSuccess = await changeWallpaper(state.wallpaperDir, filename)

  if (desktopSuccess === undefined) return cycle()

  if (state.isPaused === false) {
    cycleID = setTimeout(cycle, state.updateRateMS)
  }
}
