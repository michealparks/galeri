const { remote } = require('electron')
const onLinkClick = require('./on-link-click')
const isDarkMode = remote.systemPreferences.isDarkMode()

require('./tabs')
require('./toggle-play')
require('./artwork')
require('./prefs')

Array.from(document.querySelectorAll('a[href]'))
  .forEach(function (el) { el.onclick = onLinkClick })

document.getElementById('version').textContent = require('../../package.json').version

document.getElementById('quit').onclick = function () {
  remote.app.quit()
}
