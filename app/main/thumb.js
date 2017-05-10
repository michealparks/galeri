module.exports = {makeThumb, removeThumb}

const {unlink} = require('fs')
const http = require('http')
const https = require('https')
const sharp = require('sharp')
const configPath = require('application-config-path')('Galeri Favorites')

function makeThumb (name, href, next) {
  const protocol = href.indexOf('https://') > -1 ? https : http
  let buffer = Buffer.from([])

  protocol.get(href, res => {
    res.on('data', data => {
      buffer = Buffer.concat([buffer, data])
    })
    res.on('end', () => {
      sharp(buffer)
        .resize(750)
        .toFile(`${configPath}/${name}.jpeg`, (err, info) => next(err, info))
    })
  })
}

function removeThumb (name) {
  unlink(`${configPath}/${name}.jpeg`, (err) => {
    if (err) return console.error(err)
  })
}
