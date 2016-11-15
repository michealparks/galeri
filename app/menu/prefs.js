const ipc = require('electron').ipcRenderer
const ShowTextOnDesktopBtn = document.getElementById('show-desktop')
const UpdateRateBtn = document.getElementById('update-rate')
const AutolaunchBtn = document.getElementById('autolaunch')

let preferences = Object.seal({
  IS_AUTOLAUNCH: undefined,
  IS_TITLE_SHOWN: undefined,
  UPDATE_RATE: undefined
})

ipc.on('cached-preferences', function (e, data) {
  console.log(data)
  preferences = data
  ShowTextOnDesktopBtn.checked = preferences.IS_TITLE_SHOWN = data.IS_TITLE_SHOWN
  UpdateRateBtn.value = preferences.UPDATE_RATE = data.UPDATE_RATE
  AutolaunchBtn.checked = preferences.IS_AUTOLAUNCH = data.IS_AUTOLAUNCH
})

ipc.on('autolaunch', function (e, data) {
  preferences.IS_AUTOLAUNCH = data
  AutolaunchBtn.checked = data
})

ShowTextOnDesktopBtn.onclick = function () {
  preferences.IS_TITLE_SHOWN = this.checked
  return ipc.send('preferences', preferences)
}

UpdateRateBtn.onchange = function () {
  preferences.UPDATE_RATE = Number(this.value)
  return ipc.send('preferences', preferences)
}

AutolaunchBtn.onclick = function () {
  preferences.IS_AUTOLAUNCH = this.checked
  return ipc.send('preferences', preferences)
}
