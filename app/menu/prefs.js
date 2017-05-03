const {ipcRenderer} = require('electron')
const LabelLocationBtn = document.getElementById('label-location')
const UpdateRateBtn = document.getElementById('update-rate')
const AutolaunchBtn = document.getElementById('autolaunch')

let preferences = Object.seal({
  IS_AUTOLAUNCH: undefined,
  LABEL_LOCATION: undefined,
  UPDATE_RATE: undefined
})

ipcRenderer.on('preferences-to-menubar', function (e, data) {
  AutolaunchBtn.checked = preferences.IS_AUTOLAUNCH = data.IS_AUTOLAUNCH
  LabelLocationBtn.value = preferences.LABEL_LOCATION = data.LABEL_LOCATION
  UpdateRateBtn.value = preferences.UPDATE_RATE = data.UPDATE_RATE
})

ipcRenderer.on('autolaunch', function (e, data) {
  preferences.IS_AUTOLAUNCH = data
  AutolaunchBtn.checked = data
})

ipcRenderer.once('background-loaded', function () {
  ipcRenderer.send('menubar-needs-preferences')
})

LabelLocationBtn.onchange = function () {
  preferences.LABEL_LOCATION = this.value
  ipcRenderer.send('preferences-to-background', preferences)
}

UpdateRateBtn.onchange = function () {
  preferences.UPDATE_RATE = Number(this.value)
  ipcRenderer.send('preferences-to-background', preferences)
}

AutolaunchBtn.onclick = function () {
  preferences.IS_AUTOLAUNCH = this.checked
  ipcRenderer.send('preferences-to-background', preferences)
}
