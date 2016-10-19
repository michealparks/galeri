const { ipcRenderer } = require('electron')
const ShowTextOnDesktopBtn = document.getElementById('show-desktop')
const RefreshRateBtn = document.getElementById('refresh-rate')
const AutolaunchBtn = document.getElementById('autolaunch')

let preferences = {}

ShowTextOnDesktopBtn.onclick = function () {
  preferences.showTextOnDesktop = this.checked

  return ipcRenderer.send('preferences', preferences)
}

RefreshRateBtn.onchange = function () {
  preferences.refreshRate = this.value

  return ipcRenderer.send('preferences', preferences)
}

AutolaunchBtn.onclick = function () {
  preferences.autolaunch = this.checked

  return ipcRenderer.send('preferences', preferences)
}

ipcRenderer.on('preferences', (e, data) => {
  preferences = data
  ShowTextOnDesktopBtn.checked = preferences.showTextOnDesktop
  RefreshRateBtn.value = preferences.refreshRate
  AutolaunchBtn.checked = preferences.autolaunch
})

setTimeout(() => ipcRenderer.send('request:preferences'), 3000)
