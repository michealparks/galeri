const {extname} = require('path')
const configPath = require('./app-config-path')('Galeri')
const parenRegex = / *\([^)]*\) */g
const spaceRegex = /\s/g

module.exports = (title, text, imgsrc) => {
  const name = (title.trim() + '_' + text.trim())
    .replace(parenRegex, '').replace(spaceRegex, '_')

  return configPath + '/' + name + extname(imgsrc)
}
