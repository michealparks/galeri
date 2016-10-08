/* global XMLHttpRequest, createImageBitmap, postMessage, self */
let req

function onMakeBitmap (bitmap) {
  postMessage(bitmap)
}

function onload () {
  createImageBitmap(req.response).then(onMakeBitmap)
}

function onMessage (msg) {
  req = new XMLHttpRequest()
  req.open('GET', msg.data)
  req.setRequestHeader('cache-control', 'no-cache, no-store')
  req.setRequestHeader('pragma-directive', 'no-cache')
  req.setRequestHeader('cache-directive', 'no-cache')
  req.setRequestHeader('pragma', 'no-cache')
  req.setRequestHeader('expires', '0')
  req.responseType = 'blob'
  req.onload = onload
  req.send()
}

self.addEventListener('message', onMessage)
