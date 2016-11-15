const ipc = require('electron').ipcRenderer

let isPaused = false
let isAnimating = false

document.getElementById('btn-toggle').onclick = function (e) {
  if (isAnimating) return

  isAnimating = true
  isPaused = !isPaused

  this.classList.toggle('btn-toggle--paused', isPaused)
  setTimeout(onToggleAnimationEnd, 500)
  return ipc.send(isPaused ? 'pause' : 'play')
}

function onToggleAnimationEnd () {
  isAnimating = false
}
