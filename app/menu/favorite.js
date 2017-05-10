const ipc = require('electron').ipcRenderer
const FavoriteBtn = document.getElementById('btn-favorite')

let isFavorited = false

ipc.on('main:is-favorited', (e, favorited) => {
  isFavorited = favorited
  toggle()
})

FavoriteBtn.onclick = () => {
  isFavorited = !isFavorited
  ipc.send('menubar:is-favorited', isFavorited)
  toggle()
}

function toggle () {
  FavoriteBtn.classList.toggle('btn-favorite--active', isFavorited)
}
