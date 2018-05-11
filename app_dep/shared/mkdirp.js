module.exports = mkdirp

const {resolve, dirname} = require('path')
const {mkdir, stat} = require('fs')

function mkdirp (p, next) {
  const mode = parseInt('0777', 8) & (~process.umask())
  const pathName = resolve(p)

  mkdir(pathName, mode, (err) => {
    if (!err) return next(null, pathName)

    if (err.code === 'ENOENT') {
      return mkdirp(dirname(pathName), (_err, made) =>
        _err ? next(_err, made) : mkdirp(pathName, next))
    }

    stat(pathName, (err2, stat) =>
      // if the stat fails, then that's super weird.
      // let the original error be the failure reason.
      (err2 || !stat.isDirectory()) ? next(err) : next(null))
  })
}
