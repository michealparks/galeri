const { shell } = require('electron')

function onLinkClick (e) {
  e.preventDefault()
  return shell.openExternal(this.href)
}

module.exports = onLinkClick
