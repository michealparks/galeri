module.exports = startTextLifecycle

const ipc = require('electron').ipcRenderer
const {get, set} = require('../util/storage')
const Label = document.getElementById('description')
const LabelCL = Label.classList
const Title = Label.children[0]
const Text = Label.children[1]

let title
let text
let labelLocation = get('label-location') ||
  require('../util/default-values').labelLocation

function setTextFeatures (location) {
  LabelCL.toggle('description--invisible', location === 'menu')
  LabelCL.toggle('description--top', location === 'top')
}

function onTextHide () {
  LabelCL.add('description--bottom')
}

function onTextReplace () {
  Title.textContent = truncate(title, 50)
  Text.textContent = truncate(text, 90)
  LabelCL.add('no-transition', 'description--left')
  LabelCL.remove('description--bottom')
}

function onTextShow () {
  LabelCL.remove('no-transition', 'description--left')
}

function startTextLifecycle (data) {
  setTimeout(onTextHide, 1000)

  if (data !== undefined) {
    title = data.title
    text = data.text
    setTimeout(onTextReplace, 2200)
    setTimeout(onTextShow, 3500)
  }
}

function truncate (str, len) {
  return str.length > len ? str.slice(0, len - 3) + '...' : str
}

ipc.once('background:updated', () =>
  LabelCL.remove('description--hidden'))

ipc.on('menubar:get-settings', () =>
  ipc.send('background:label-location', labelLocation))

ipc.on('menubar:label-location', (e, location) => {
  labelLocation = location
  setTextFeatures(location)
  set('label-location', location)
})

setTextFeatures(labelLocation)
