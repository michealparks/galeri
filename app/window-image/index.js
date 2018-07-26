import {ipcRenderer as ipc} from 'electron'
import {addImage} from './add-image'

let currentHref

ipc.on('new-artwork', (e, data) => {
  if (data.href !== currentHref) {
    addImage(data.filepath)
  }

  currentHref = data.href
})

ipc.send('image-window-loaded')
