const { ipcRenderer, remote } = require('electron')
const App = require('./app')

let state = {
  pref_showOnDesktop: true,
  isDarkMode: remote.systemPreferences.isDarkMode()
}

const update = newState => {
  return App(Object.assign(state, newState))
}

ipcRenderer.on('preferences', (e, config) => {
  update(config)
})

