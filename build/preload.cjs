const { ipcRenderer, contextBridge, shell } = require('electron')

contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => {
    ipcRenderer.send(channel, data)
  },
  on: (channel, func) => {
    ipcRenderer.on(channel, (_, ...args) => func(...args))
  }
})

contextBridge.exposeInMainWorld('shell', {
  openExternal: (url) => {
    shell.openExternal(url)
  }
})
