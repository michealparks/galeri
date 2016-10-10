const { remote, shell } = require('electron')
const isDarkMode = remote.systemPreferences.isDarkMode()

require('./tabs')
require('./toggle-play')
require('./artwork')
require('./prefs')

function onLinkClick (e) {
  e.preventDefault()
  shell.openExternal(this.href)
}

Array.from(document.querySelectorAll('a[href]'))
  .forEach(function (el) { el.onclick = onLinkClick })

document.getElementById('version').textContent = require('../../package.json').version

document.getElementById('quit').onclick = function () {
  remote.app.quit()
}
