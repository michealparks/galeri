import {nativeImage} from 'electron'
import {unlink, writeFile} from 'fs'
import http from 'http'
import https from 'https'
import configPath from '../shared/app-config-path'

const path = configPath('Galeri Favorites')

const writeThumb = (name, buffer, next) => {
  const imgBuffer = nativeImage
    .createFromBuffer(buffer)
    .resize({ width: 750 })
    .toJPEG(100)

  writeFile(`${path}/${name}.jpeg`, imgBuffer, next)
}

export const makeThumb = (name, href, next) => {
  const protocol = href.indexOf('https://') !== -1 ? https : http
  let buf = Buffer.from([])

  protocol.get(href, res => {
    res.on('data', data => {
      buf = Buffer.concat([buf, data])
    })
    res.on('end', () => writeThumb(name, buf, next))
  })
}

export const removeThumb = (name) => {
  unlink(`${path}/${name}.jpeg`, (err) =>
    err && console.warn(err))
}
