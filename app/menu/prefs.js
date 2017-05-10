const ipc = require('electron').ipcRenderer
const LabelLocationBtn = document.getElementById('label-location')
const UpdateRateBtn = document.getElementById('update-rate')
const AutolaunchBtn = document.getElementById('autolaunch')

let isAutolaunchEnabled
let labelLocation
let updateRate

ipc.once('background:loaded', () =>
  ipc.send('menubar:get-settings'))

ipc.on('background:label-location', (e, location) => {
  LabelLocationBtn.value = labelLocation = location
})

ipc.on('background:update-rate', (e, rate) => {
  UpdateRateBtn.value = updateRate = rate
})

ipc.on('main:is-autolaunch-enabled', (e, isEnabled) => {
  AutolaunchBtn.checked = isAutolaunchEnabled = isEnabled
})

LabelLocationBtn.onchange = (e) => {
  labelLocation = e.currentTarget.value
  ipc.send('menubar:label-location', labelLocation)
}

UpdateRateBtn.onchange = (e) => {
  updateRate = Number(e.currentTarget.value)
  ipc.send('menubar:update-rate', updateRate)
}

AutolaunchBtn.onclick = (e) => {
  isAutolaunchEnabled = e.currentTarget.checked
  ipc.send('menubar:is-autolaunch-enabled', isAutolaunchEnabled)
}
