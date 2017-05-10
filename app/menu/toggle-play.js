const ipc = require('electron').ipcRenderer
const ToggleBtn = document.getElementById('btn-toggle')

let isPaused = false
let isAnimating = false

ipc.on('background:is-paused', (e, paused) => {
  isPaused = paused
  toggle()
})

ToggleBtn.onclick = () => {
  if (isAnimating) return

  isPaused = !isPaused

  ipc.send('menubar:is-paused', isPaused)
  toggle()
}

function toggle () {
  isAnimating = true
  ToggleBtn.classList.toggle('btn-toggle--paused', isPaused)
  setTimeout(onToggleAnimationEnd, 500)
}

function onToggleAnimationEnd () {
  isAnimating = false
}
