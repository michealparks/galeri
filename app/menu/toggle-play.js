const ipc = require('electron').ipcRenderer
const ToggleBtn = document.getElementById('btn-toggle')

let isPaused = false
let isAnimating = false

ipc.on('cached-preferences', function (e, data) {
  if (data.hasOwnProperty('IS_PAUSED')) {
    isPaused = data.IS_PAUSED
    return animateToggle()
  }
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
