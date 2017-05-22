module.exports = runStylus

const stylus = require('stylus')
const fs = require('fs')
const r = require('path').resolve
const root = r(__dirname, '..')

function runStylus (args) {
  return new Promise((resolve, reject) =>
    fs.readdir(r(root, 'app/styles'), (err, files) => err
      ? reject(err)
      : resolve(files))
  ).then(files => {
    if (args.watch) {
      files.forEach(file => {
        console.log('watching', file)
        fs.watch(getFilePath(file), () => compile(file))
      })
      return Promise.resolve()
    }

    return Promise.all(files.map(compile))
  })
}

function compile (file) {
  const filename = file.replace('.styl', '.css')
  console.log('compiling', filename)

  return new Promise((resolve, reject) =>
    fs.readFile(getFilePath(file), 'utf-8', (err, str) => err
      ? reject(err)
      : stylus.render(str, { filename }, (err, css) => err
        ? reject(err)
        : fs.writeFile(r(root, 'build', filename), css, () => err
          ? reject(err)
          : resolve(filename)
        )
      )
    )
  )
}

function getFilePath (file) {
  return r(root, 'app/styles', file)
}
