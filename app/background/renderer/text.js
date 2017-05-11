module.exports = startTextLifecycle

const ipc = require('electron').ipcRenderer
const {get, set} = require('../util/storage')
const Label = document.getElementById('description')
const LabelCL = Label.classList
const Title = Label.children[0]
const Text = Label.children[1]

let labelLocation = get('label-location') ||
  require('../util/default-values').labelLocation

function setTextFeatures (location) {
  LabelCL.toggle('description--invisible', location === 'menu')
  LabelCL.toggle('description--top', location === 'top')
}

function onTextHide () {
  LabelCL.add('description--bottom')
}

function onTextReplace (title, text) {
  Title.textContent = truncate(title, 50)
  Text.textContent = truncate(text, 90)
  LabelCL.add('no-transition', 'description--left')
  LabelCL.remove('description--bottom')
}

function onTextShow () {
  LabelCL.remove('description--hidden', 'no-transition', 'description--left')
}

function startTextLifecycle (data) {
  setTimeout(onTextHide, 1000)

  if (data !== undefined) {
    setTimeout(onTextReplace, 2200, data.title, data.text)
    setTimeout(onTextShow, 3500)
  }
}

function truncate (str, len) {
  return str.length > len ? str.slice(0, len - 3) + '...' : str
}

ipc.on('menubar:get-settings', () =>
  ipc.send('background:label-location', labelLocation))

ipc.on('menubar:label-location', (e, location) => {
  labelLocation = location
  setTextFeatures(location)
  set('label-location', location)
})

setTextFeatures(labelLocation)
