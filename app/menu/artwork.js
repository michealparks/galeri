const { ipcRenderer } = require('electron')
// const ArtBlurb = document.getElementById('artwork-blurb')
const ArtSource = document.getElementById('artwork-source')
const ArtLink = document.getElementById('artwork-link')

ipcRenderer.on('artwork', function (e, data) {
  // ArtBlurb.innerHTML = data.blurb
  ArtSource.textContent = data.source
  ArtLink.href = data.href

  // function preventAction (e) {
  //   e.preventDefault()
  // }

  // Array.prototype.slice.call(ArtBlurb.querySelectorAll('a[href]'))
  //   .forEach(a => {
  //     a.removeAttribute('href')
  //     a.onclick = preventAction
  //   })
})
