const { ipcRenderer } = require('electron')
const config = require('../util/config')
const ShowTextOnDesktopBtn = document.getElementById('show-desktop')
const RefreshRateBtn = document.getElementById('refresh-rate')
const AutolaunchBtn = document.getElementById('autolaunch')

let preferences = {}

config.get(onGetPrefs)

ShowTextOnDesktopBtn.onclick = function () {
  preferences.showTextOnDesktop = this.checked

  return ipcRenderer.send('preferences', preferences)
}

RefreshRateBtn.onchange = function () {
  preferences.refreshRate = Number(this.value)

  return ipcRenderer.send('preferences', preferences)
}

AutolaunchBtn.onclick = function () {
  preferences.autolaunch = this.checked

  return ipcRenderer.send('preferences', preferences)
}

ipcRenderer.on('preferences', (e, data) => onGetPrefs(data))

function onGetPrefs (data) {
  preferences = data
  ShowTextOnDesktopBtn.checked = preferences.showTextOnDesktop
  RefreshRateBtn.value = preferences.refreshRate
  AutolaunchBtn.checked = preferences.autolaunch
}
