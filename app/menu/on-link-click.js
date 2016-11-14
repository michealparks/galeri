const { shell } = require('electron')

function onLinkClick (e) {
  e.preventDefault()
  return shell.openExternal(this.href)
}

Array.from(document.querySelectorAll('a[href]')).forEach(function (el) {
  el.onclick = onLinkClick
})
