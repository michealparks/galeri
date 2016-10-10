const { ipcRenderer } = require('electron')

let isPaused = false
let isAnimating = false

document.getElementById('btn-toggle').onclick = function (e) {
  if (isAnimating) return
  isAnimating = true
  isPaused = !isPaused
  this.classList.toggle('btn-toggle--paused', isPaused)
  setTimeout(onToggleAnimationEnd, 500)
  ipcRenderer.send(isPaused ? 'pause' : 'resume')
}

function onToggleAnimationEnd () {
  isAnimating = false
}
