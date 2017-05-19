module.exports = html

const fs = require('fs')
const minify = require('html-minifier').minify
const inline = require('inline-source')
const resolve = require('path').resolve
const root = require('../app/main/config').ROOT_PATH

function html () {
  return Promise.all([
    inlinePage(resolve(root, 'app/background.html')),
    inlinePage(resolve(root, 'app/bg-clone.html')),
    inlinePage(resolve(root, 'app/menubar.html')),
    inlinePage(resolve(root, 'app/about.html')),
    inlinePage(resolve(root, 'app/favorites.html'))
  ]).then((pages) => {
    const opts = {
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: true
    }

    const bgPage = minify(pages[0], opts)
    const clonePage = minify(pages[1], opts)
    const menuPage = minify(pages[2], opts)
    const aboutPage = minify(pages[3], opts)
    const favoritesPage = minify(pages[4], opts)

    fs.writeFileSync(resolve(root, 'build/background.html'), bgPage)
    fs.writeFileSync(resolve(root, 'build/bg-clone.html'), clonePage)
    fs.writeFileSync(resolve(root, 'build/menubar.html'), menuPage)
    fs.writeFileSync(resolve(root, 'build/about.html'), aboutPage)
    fs.writeFileSync(resolve(root, 'build/favorites.html'), favoritesPage)

    return Promise.resolve()
  })
}

function inlinePage (path) {
  return new Promise((resolve, reject) => {
    inline(path, {
      compress: false,
      // rootpath: resolve(ROOT, 'app'),
      ignore: []
    }, (err, html) => err ? reject(err) : resolve(html))
  })
}
