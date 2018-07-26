import {ipcMain as ipc} from 'electron'
import {tray, menuWindow} from './windows/menu'
import {windows as imageWindows} from './display'

export const sendArtToWindows = (art) => {
  tray.setToolTip(`${art.title}\n${art.text}\n${art.source}`)

  for (let i = 0, l = imageWindows.length; i < l; i++) {
    imageWindows[i].webContents.send('new-artwork', art)
  }

  menuWindow.webContents.send('new-artwork', art)
}

ipc.on('delete-favorite', (e, href) => {

})

ipc.on('pause', (e, isPaused) => {

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
