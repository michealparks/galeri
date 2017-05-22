module.exports = html

const fs = require('fs')
const r = require('path').resolve
const del = require('del')
const minify = require('html-minifier').minify
const inline = require('inline-source')
const root = require('../app/main/config').ROOT_PATH

const opts = {
  collapseWhitespace: true,
  minifyCSS: true,
  minifyJS: true
}

function html () {
  return Promise.all([
    inlinePage('background'),
    inlinePage('bg-clone'),
    inlinePage('menubar'),
    inlinePage('about'),
    inlinePage('favorites')
  ]).then((pages) => Promise.all([
    writeFile('background', minify(pages[0], opts)),
    writeFile('bg-clone', minify(pages[1], opts)),
    writeFile('menubar', minify(pages[2], opts)),
    writeFile('about', minify(pages[3], opts)),
    writeFile('favorites', minify(pages[4], opts))
  ])).then(() =>
    del([
      `${root}/build/*.js`,
      `${root}/build/*.css`
    ])
  ).catch(err => console.error(err))
}

function inlinePage (file) {
  return new Promise((resolve, reject) =>
    inline(r(root, 'app', file + '.html'), {
      compress: false,
      ignore: []
    }, (err, html) => err ? reject(err) : resolve(html)))
}

function writeFile (file, str) {
  return new Promise((resolve, reject) =>
    fs.writeFile(r(root, 'build', file + '.html'), str, (err) =>
      err ? reject(err) : resolve()))
}
