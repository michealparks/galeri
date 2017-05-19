const open = require('../shared/open')

for (let i = 0, a = document.getElementsByTagName('a'), l = a.length; i < l; ++i) {
  a[i].onclick = onLinkClick
}

function onLinkClick (e) {
  e.preventDefault()

  return open(this.href.indexOf('https://metmuseum.org') !== -1
    ? this.href.replace('https', 'http')
    : this.href)
}
