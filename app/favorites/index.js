const ipc = require('electron').ipcRenderer
const open = require('../shared/open')
const configPath = require('../shared/app-config-path')('Galeri Favorites')
const Favorites = document.getElementById('favorites')
const NoFavorites = document.getElementById('no-favorites')

if (process.platform === 'linux') {
  document.body.classList.add('linux')
}

document.body.onclick = (e) => {
  const {target} = e

  if (target.classList.contains('delete')) {
    return ipc.send('favorites:delete', target.getAttribute('data-href'))
  }

  if (target.classList.contains('info')) {
    const href = target.getAttribute('data-href')

    return open(href.indexOf('https://metmuseum.org') !== -1
      ? href.replace('https', 'http')
      : href)
  }
}

ipc.on('main:favorites', (e, favorites) => {
  const frag = document.createDocumentFragment()

  NoFavorites.classList.toggle('no-favorites--hidden', favorites.length !== 0)

  for (let item, url, i = favorites.length - 1; i > -1; --i) {
    item = favorites[i]
    url = `${configPath}/${item.title} - ${item.text} - ${item.source}.jpeg`

    const child = document.createElement('div')
    child.className = 'favorite'
    child.style.backgroundImage = `url("${url}")`

    child.innerHTML = `
      <div class='content'>
        <svg class="delete icon icon-delete" data-href='${item.href}'>
          <use class='delete' xlink:href="#icon-delete" data-href='${item.href}'></use>
        </svg>
        <svg class="info icon icon-info" data-href='${item.href}'>
          <use class='info' xlink:href='#icon-info' data-href='${item.href}'></use>
        </svg>
        <div class='text'>
          <div>
            <p>${item.title}</p>
            <small>${item.text}</small>
          </div>
          
          <small>${item.source}</small>
        </div>
      </div>
    `

    frag.appendChild(child)
  }

  Favorites.innerHTML = ''
  Favorites.appendChild(frag)
})

ipc.send('favorites:loaded')
