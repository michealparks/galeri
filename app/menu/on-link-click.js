const { shell } = require('electron')

function onLinkClick (e) {
  e.preventDefault()
  shell.openExternal(this.href)
}

module.exports = onLinkClick
