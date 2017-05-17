const ipc = require('electron').ipcRenderer
const FavoriteBtn = document.getElementById('btn-favorite')

let isFavorited = false

ipc.on('main:is-favorited', (e, favorited) => toggle(favorited))

FavoriteBtn.onclick = () => {
  toggle(!isFavorited)
  ipc.send('menubar:is-favorited', isFavorited)
}

function toggle (flag) {
  isFavorited = flag
  FavoriteBtn.classList.toggle('btn-favorite--active', isFavorited)
}
