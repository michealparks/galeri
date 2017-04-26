const open = require('open')
const metStr = /^https:\/\/metmuseum.org\/art\/collection\/search\//

for (let i = 0, links = document.querySelectorAll('a[href]'), l = links.length; i < l; ++i) {
  links[i].onclick = onLinkClick
}

function onLinkClick (e) {
  e.preventDefault()

  return open(metStr.test(this.href)
    ? this.href.replace('https', 'http')
    : this.href)
}
