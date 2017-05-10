const {ipcRenderer} = require('electron')
const ToggleBtn = document.getElementById('btn-toggle')

let isPaused = false
let isAnimating = false

ipcRenderer.on('preferences-to-menubar', function (e, data) {
  if (data.IS_PAUSED === undefined) return

  isPaused = data.IS_PAUSED
  animateToggle()
})

ToggleBtn.onclick = function (e) {
  if (isAnimating) return

  isPaused = !isPaused

  animateToggle()
  ipcRenderer.send(isPaused ? 'pause' : 'play')
}

function animateToggle () {
  isAnimating = true
  ToggleBtn.classList.toggle('btn-toggle--paused', isPaused)
  setTimeout(onToggleAnimationEnd, 500)
}

function onToggleAnimationEnd () {
  isAnimating = false
}
