import {ipcMain as ipc} from 'electron'
import {tray, menuWindow} from './windows/menu'
import {windows as imageWindows} from './display'

let __resolve

export const sendArtToWindows = (art) => new Promise(resolve => {
  __resolve = resolve

  tray.setToolTip(`${art.title}\n${art.text}\n${art.source}`)

  for (let i = 0, l = imageWindows.length; i < l; i++) {
    imageWindows[i].webContents.send('new-artwork', art)
  }

  menuWindow.webContents.send('new-artwork', art)
  resolve(true)
})

ipc.on('new-artwork-loaded', (e, success) => {
  __resolve(success)
})

ipc.on('delete-favorite', (e, href) => {

})

ipc.on('label-location-changed', (e, position) => {

})

ipc.on('update-rate-changed', (e, rate) => {

})

ipc.on('menu-loaded', (e) => {

})

ipc.on('open-about', (e) => {

})

ipc.on('image-window-loaded', (e) => {

})
