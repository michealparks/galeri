import {ipcRenderer as ipc} from 'electron'
import fillBackground from '../background/renderer/background'

let currentHref

const onArtwork = (e, data) => {
  if (data.href !== currentHref) {
    fillBackground(data, onFill)
  }

  currentHref = data.href
}

const onFill = () => {}

ipc.on('background:artwork', onArtwork)
ipc.once('main:artwork', onArtwork)
ipc.send('clone:loaded')
