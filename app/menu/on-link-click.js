const { shell } = require('electron')

function onLinkClick (e) {
  e.preventDefault()
  return shell.openExternal(this.href)
}

const links = document.querySelectorAll('a[href]')
for (let i = 0, l = links.length; i < l; ++i) {
  links[i].onclick = onLinkClick
}
