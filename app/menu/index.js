const React = require('react')
const { render } = require('react-dom')
const App = require('./app')
const root = document.querySelector('#root')

let isDarkMode = require('electron').remote.systemPreferences.isDarkMode()

let state = {

}

render(<App {...state} />, root)
