import open from '../shared/open'

const onLinkClick = (e) => {
  e.preventDefault()
  return open(e.currentTarget.href)
}

for (let i = 0, a = document.getElementsByTagName('a'), l = a.length; i < l; ++i) {
  a[i].onclick = onLinkClick
}
