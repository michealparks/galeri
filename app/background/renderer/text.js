import {ipcRenderer as ipc} from 'electron'
import storage from '../util/storage'
import {LABEL_LOCATION} from '../util/default-values'

const Label = document.getElementById('description')
const LabelCL = Label.classList
const Title = Label.children[0]
const Text = Label.children[1]

let labelLocation = storage('label-location') || LABEL_LOCATION

const setTextFeatures = (location) => {
  LabelCL.toggle('invisible', location === 'menu')
  LabelCL.toggle('top', location === 'top')
}

const onTextHide = () => {
  LabelCL.add('bottom')
}

const onTextReplace = (title, text) => {
  Title.textContent = truncate(title, 50)
  Text.textContent = truncate(text, 90)
  LabelCL.add('no-transition', 'left')
  LabelCL.remove('bottom')
}

const onTextShow = () => {
  LabelCL.remove('hidden', 'no-transition', 'left')
}

const truncate = (str, len) => {
  return str.length > len ? str.slice(0, len - 3) + '...' : str
}

export default (data) => {
  setTimeout(onTextHide, 1000)

  if (data !== undefined) {
    setTimeout(onTextReplace, 2200, data.title, data.text)
    setTimeout(onTextShow, 3500)
  }
}

ipc.on('menubar:loaded', () =>
  ipc.send('background:label-location', labelLocation))

ipc.on('menubar:label-location', (e, location) => {
  labelLocation = location
  setTextFeatures(location)
  storage('label-location', location)
})

setTextFeatures(labelLocation)
