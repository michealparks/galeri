const ipc = require('electron').ipcRenderer
const LabelLocationBtn = document.getElementById('label-location')
const UpdateRateBtn = document.getElementById('update-rate')
const AutolaunchBtn = document.getElementById('autolaunch')

let preferences = Object.seal({
  IS_AUTOLAUNCH: undefined,
  LABEL_LOCATION: undefined,
  UPDATE_RATE: undefined
})

ipc.on('preferences-to-menubar', function (e, data) {
  AutolaunchBtn.checked = preferences.IS_AUTOLAUNCH = data.IS_AUTOLAUNCH
  LabelLocationBtn.value = preferences.LABEL_LOCATION = data.LABEL_LOCATION
  UpdateRateBtn.value = preferences.UPDATE_RATE = data.UPDATE_RATE
})

ipc.on('autolaunch', function (e, data) {
  preferences.IS_AUTOLAUNCH = data
  AutolaunchBtn.checked = data
})

ipc.once('background-loaded', function () {
  ipc.send('menubar-needs-preferences')
})

LabelLocationBtn.onchange = function () {
  preferences.LABEL_LOCATION = this.value
  return ipc.send('preferences-to-background', preferences)
}

UpdateRateBtn.onchange = function () {
  preferences.UPDATE_RATE = Number(this.value)
  return ipc.send('preferences-to-background', preferences)
}

AutolaunchBtn.onclick = function () {
  preferences.IS_AUTOLAUNCH = this.checked
  return ipc.send('preferences-to-background', preferences)
}
