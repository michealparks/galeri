const ipc = require('electron').ipcRenderer
const openBrowser = require('../util/open')
const imageFilename = require('../util/image-filename')
const noFavoritesCL = window.nofavorites.classList

if (__linux__) document.body.classList.add('linux')

document.body.onclick = ({target}) => {
  if (target.classList.contains('delete')) {
    return ipc.send('favorites:delete', target.getAttribute('data-href'))
  }

  if (target.classList.contains('info')) {
    return openBrowser(target.getAttribute('data-href'))
  }
}

ipc.on('main:favorites', (e, favorites) => {
  const frag = document.createDocumentFragment()

  noFavoritesCL.toggle('hidden', favorites.length !== 0)

  for (let i = favorites.length - 1; i > -1; i -= 1) {
    const {title, text, source, href, imgsrc} = favorites[i]
    const url = imageFilename(title, text, imgsrc)
    const child = document.createElement('div')

    child.className = 'favorite'
    child.style.backgroundImage = `url("${url}")`
    child.innerHTML = `
      <div class='content'>
        <svg class="delete icon icon-delete" data-href='${href}'>
          <use class='delete' xlink:href="#icon-delete" data-href='${href}'></use>
        </svg>
        <svg class="info icon icon-info" data-href='${href}'>
          <use class='info' xlink:href='#icon-info' data-href='${href}'></use>
        </svg>
        <div class='text'>
          <div>
            <p>${title}</p>
            <small>${text}</small>
          </div>
          
          <small>${source}</small>
        </div>
      </div>
    `

    frag.appendChild(child)
  }

  window.favorites.innerHTML = ''
  window.favorites.appendChild(frag)
})

ipc.send('favorites:loaded')
