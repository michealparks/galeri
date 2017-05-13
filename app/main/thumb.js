module.exports = {makeThumb, removeThumb}

const {nativeImage} = require('electron')
const {unlink, writeFile} = require('fs')
const http = require('http')
const https = require('https')
const configPath = require('application-config-path')('Galeri Favorites')

function makeThumb (name, href, next) {
  const protocol = href.indexOf('https://') > -1 ? https : http
  let buf = Buffer.from([])

  protocol.get(href, res => {
    res.on('data', data => {
      buf = Buffer.concat([buf, data])
    })
    res.on('end', () =>
      writeThumb(name, buf, next))
  })
}

function writeThumb (name, buffer, next) {
  const imgBuffer = nativeImage
    .createFromBuffer(buffer)
    .resize({ width: 750 })
    .toJPEG(100)

  writeFile(`${configPath}/${name}.jpeg`, imgBuffer, next)
}

function removeThumb (name) {
  unlink(`${configPath}/${name}.jpeg`, (err) =>
    err && console.warn(err))
}
