import {createWriteStream, unlink} from 'fs'
import fetch from 'node-fetch'
import {mkdirp} from '../../shared/mkdirp'
import {appConfigPath} from '../../shared/app-config-path'

const imgPath = appConfigPath('Galeri Images')

mkdirp(imgPath, () => {})

const fileify = (str) => {
  return str.toLowerCase().replace(/\s/g, '_')
}

export const downloadImage = async (art) => {
  const res = await fetch(art.img)

  return new Promise((resolve) => {
    const filepath = `${imgPath}/${fileify(art.source)}_${fileify(art.title)}${art.ext}`

    const dest = createWriteStream(filepath)

    res.body.pipe(dest)
    res.body.on('error', (err) => resolve([err]))

    dest.on('finish', () => resolve([undefined, filepath]))
    dest.on('error', (err) => resolve([err]))
  })
}
