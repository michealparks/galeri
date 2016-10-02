const { ipcRenderer, remote } = require('electron')
const React = require('react')
const { render } = require('react-dom')
const App = require('./app')
const root = document.querySelector('#root')

let isDarkMode = remote.systemPreferences.isDarkMode()

let state = {
  pref_showOnDesktop: true
}

const update = newState => render(
  <App {...Object.assign(state, newState)} />,
  root
)

ipcRenderer.on('preferences', (e, config) => {
  update(config)
})

render(<App {...state} />, root)
