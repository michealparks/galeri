const ipc = require('electron').ipcRenderer
const ToggleBtn = document.getElementById('btn-toggle')

let isPaused = false
let isAnimating = false

ipc.on('preferences-to-menubar', function (e, data) {
  if (data.IS_PAUSED === undefined) return

  isPaused = data.IS_PAUSED
  return animateToggle()
})

ToggleBtn.onclick = function (e) {
  if (isAnimating) return

  isPaused = !isPaused

  animateToggle()
  return ipc.send(isPaused ? 'pause' : 'play')
}

function animateToggle () {
  isAnimating = true
  ToggleBtn.classList.toggle('btn-toggle--paused', isPaused)
  return setTimeout(onToggleAnimationEnd, 500)
}

function onToggleAnimationEnd () {
  isAnimating = false
}
