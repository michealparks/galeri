const ipc = require('electron').ipcRenderer
const ToggleBtn = document.getElementById('btn-toggle')

let isPaused = false
let isAnimating = false

ipc.on('background:is-paused', (e, paused) => toggle(paused))

ToggleBtn.onclick = () => {
  if (isAnimating) return

  toggle(!isPaused)
  ipc.send('menubar:is-paused', isPaused)
}

function toggle (flag) {
  isAnimating = true
  isPaused = flag

  ToggleBtn.classList.toggle('btn-toggle--paused', isPaused)
  setTimeout(onToggleAnimationEnd, 500)
}

function onToggleAnimationEnd () {
  isAnimating = false
}
