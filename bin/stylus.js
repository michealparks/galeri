const __dev__ = process.argv[2] === 'dev'
const stylus = require('stylus')
const fs = require('fs')
const resolve = require('path').resolve
const root = resolve(__dirname, '..')

function getFilePath (file) {
  return resolve(root, 'app/styles', file)
}

function compile (file) {
  const name = file.replace('.styl', '.css')
  console.log('compiling', name)
  fs.readFile(getFilePath(file), 'utf-8', (err, str) => {
    if (err) return console.error(err)
    stylus.render(str, { filename: name }, (err, css) => {
      if (err) return console.error(err)
      fs.writeFile(resolve(root, 'build', name), css, () => {
        if (err) return console.error(err)
      })
    })
  })
}

fs.readdir(resolve(root, 'app/styles'), (err, files) => {
  if (err) return console.error(err)

  if (!__dev__) return files.forEach(compile)

  files.forEach((file) => {
    console.log('watching', file)
    compile(file)
    fs.watch(getFilePath(file), () => compile(file))
  })
})
