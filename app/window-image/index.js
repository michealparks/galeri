import {ipcRenderer as ipc} from 'electron'
import {addImage} from './add-image'

let currentHref

ipc.on('new-artwork', async (e, data) => {
  if (data.href === currentHref) return

  const success = await addImage(data.filepath)

  ipc.send('new-artwork-loaded', success)

  if (success) {
    currentHref = data.href
  }
})

ipc.send('image-window-loaded')
