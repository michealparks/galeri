import {ipcRenderer as ipc} from 'electron'
import storage from '../util/storage'
import addImage from './background'
import replaceText from './text'
import {getNextArtwork, saveConfig} from '../museums'
import {UPDATE_RATE} from '../util/default-values'

let imageCount = 0
let restartCount = 10e100
let updateRate = storage('update-rate') || UPDATE_RATE

const prepareExit = () => {
  saveConfig()
  replaceText()
  ipc.send('background:reset')
}

const render = async () => {
  if (__dev__) console.log('render()')

  const art = await getNextArtwork()

  if (art === undefined) return render()

  const error = await addImage(art.img)

  if (error !== undefined) return render()

  ipc.send('background:artwork', art)
  replaceText(art)

  if (imageCount === 0) {
    ipc.send('background:rendered')
  }

  if (!__linux__) imageCount += 1

  if (imageCount === restartCount) {
    ipc.send('background:updated')
    return setTimeout(prepareExit, updateRate)
  }
}

ipc.on('menubar:update-rate', (e, rate) => {
  updateRate = rate
})

export default render
