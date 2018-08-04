import {createReadStream, createWriteStream, lstat, stat, unlink, access, readdir, rmdir, mkdir} from 'fs'
import path, {join, dirname} from 'path'
import {fetch} from './index'

export const downloadFile = async (source, dest) => {
  const file = await fetch(source)

  if (file === undefined) return Promise.resolve('downloadFile() failed for ', source)

  return new Promise(resolve => {
    let cbCalled = false

    const done = (err) => {
      if (!cbCalled) {
        resolve(err)
        cbCalled = true
      }
    }

    const wr = createWriteStream(dest)

    file.body.pipe(wr)
    file.body.on('error', (err) => done(err))
    wr.on('error', (err) => done(err))
    wr.on('close', (ex) => done())
  })
}

export const copyFile = (source, target) => new Promise(resolve => {
  let cbCalled = false

  const done = (err) => {
    if (!cbCalled) {
      resolve(err)
      cbCalled = true
    }
  }

  const rd = createReadStream(source)
  const wr = createWriteStream(target)

  rd.on('error', (err) => done(err))
  wr.on('error', (err) => done(err))
  wr.on('close', (ex) => done())

  rd.pipe(wr)
})

export const deleteFile = (dir, file) => new Promise(resolve => {
  const filePath = join(dir, file)

  lstat(filePath, (err, stats) => {
    if (err) return resolve(err)

    if (stats.isDirectory()) {
      resolve(deleteDir(filePath))
    } else {
      unlink(filePath, (err) => {
        return err ? resolve(err) : resolve()
      })
    }
  })
})

export const deleteDir = (dir) => new Promise(resolve => {
  access(dir, (err) => {
    if (err) return resolve(err)

    readdir(dir, (err, files) => {
      if (err) return resolve(err)

      Promise
        .all(files.map((file) => deleteFile(dir, file)))
        .then(() => rmdir(dir, (err) => {
          return err ? resolve(err) : resolve()
        }))
        .catch(err => resolve(err))
    })
  })
})

let __resolve

// export const makeDir = (p) => {
//   const mode = parseInt('0777', 8) & (~process.umask())
//   const pathName = path.resolve(p)

//   const mkdirp = (path) => {
//     mkdir
//   }

//   return new Promise(resolve => {

//   })
// }

export const makeDir = (p) => new Promise(resolve => {
  __resolve = resolve
  const mode = parseInt('0777', 8) & (~process.umask())
  const pathName = path.resolve(p)

  mkdir(pathName, mode, (err) => {
    if (!err) return __resolve()

    if (err.code === 'ENOENT') {
      return makeDir(dirname(pathName), (err, made) =>
        err ? __resolve(err) : makeDir(pathName))
    }

    stat(pathName, (err2, stat) =>
      // if the stat fails, then that's super weird.
      // let the original error be the failure reason.
      (err2 || !stat.isDirectory()) ? __resolve(err) : __resolve())
  })
})
