const os = require('os')
const { ipcRenderer, contextBridge, shell } = require('electron')

contextBridge.exposeInMainWorld('messageService', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args))
  }
})

contextBridge.exposeInMainWorld('openLink', (url) => {
  shell.openExternal(url)
})

contextBridge.exposeInMainWorld('platform', os.platform())