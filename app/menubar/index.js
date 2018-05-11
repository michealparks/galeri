require('../globals')
require('./locale')

const electron = require('electron')
const openBrowser = require('../util/open-browser')
const autolaunch = require('./autolaunch')

const ipc = electron.ipcRenderer
const find = document.querySelector.bind(document)
const findAll = document.getElementsByTagName.bind(document)

let isFavorited, isPaused

const [Nav, DescriptionTab, SettingsTab] = find('main').children
const [BtnAbout, BtnFaved, BtnQuit] = find('misc-options').children
const [, BtnInfoTab, BtnPrefs, BtnFav, BtnTogglePlay] = Nav.children
const [LabelPos, UpdateRate] = findAll('select')
const [ArtTitle, ArtText, , ArtSource, ArtLink] = window.description.children
const BtnAutolaunch = find('input')
const arrowCL = Nav.children[0].classList
const tabCL = [DescriptionTab.classList, SettingsTab.classList]

const truncate = (str, len) => str.length > len
  ? str.slice(0, len - 3) + '...' : str

const toggleFavorite = (flag) => {
  isFavorited = flag
  BtnFav.classList.toggle('active', isFavorited)
}

const togglePlay = (flag) => {
  isPaused = flag
  BtnTogglePlay.classList.toggle('paused', isPaused)
}

const toggleTab = (n) => {
  arrowCL.toggle('tab-0', n === 0)
  arrowCL.toggle('tab-1', n === 1)
  tabCL[n].remove('hidden')
  tabCL[n ^ 1].add('hidden')
}

const onLinkClick = (e) => {
  e.preventDefault()
  openBrowser(e.currentTarget.href)
}

for (let i = 0, a = findAll('a'), l = a.length; i < l; ++i) {
  a[i].onclick = onLinkClick
}

setTimeout(() => autolaunch.isEnabled(isEnabled => {
  BtnAutolaunch.checked = isEnabled
}), 500)

ipc.on('main:update-available', () => {
  document.body.classList.add('update-available')
})

ipc.on('background:label-location', (e, location) => {
  LabelPos.value = location
})

ipc.on('background:update-rate', (e, rate) => {
  UpdateRate.value = rate
})

ipc.on('main:artwork', (e, {source, href, title, text, isFavorited}) => {
  toggleFavorite(isFavorited || false)

  ArtTitle.textContent = truncate(title, 50)
  ArtText.textContent = truncate(text, 90)
  ArtLink.href = href
  ArtSource.textContent = source
})

ipc.on('background:is-paused', (e, paused) => togglePlay(paused))

ipc.on('favorites:delete', () => toggleFavorite(false))

BtnQuit.onclick = () => ipc.send('menubar:quit')
BtnAbout.onclick = () => ipc.send('menubar:open-about')
BtnFaved.onclick = () => ipc.send('menubar:open-favorites')
BtnInfoTab.onclick = () => toggleTab(0)
BtnPrefs.onclick = () => toggleTab(1)

LabelPos.onchange = (e) =>
  ipc.send('menubar:label-location', e.currentTarget.value)

UpdateRate.onchange = (e) =>
  ipc.send('menubar:update-rate', parseInt(e.currentTarget.value))

BtnAutolaunch.onclick = (e) => e.currentTarget.checked
  ? autolaunch.enable()
  : autolaunch.disable()

BtnFav.onclick = () => {
  toggleFavorite(!isFavorited)
  ipc.send('menubar:is-favorited', isFavorited)
}

BtnTogglePlay.onclick = () => {
  togglePlay(!isPaused)
  ipc.send('menubar:is-paused', isPaused)
}
