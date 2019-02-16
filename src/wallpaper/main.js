const wallpaper = __windows ? require('wallpaper') : null

export function setWallpaper (path, fn) {
  if (__macOS) return fn()

  wallpaper.set(path).then(function () {
    fn()
  }).catch(function (err) {
    fn(err)
  })
}

export function getWallpaper (fn) {
  if (__macOS) return fn()

  wallpaper.get(function (file) {
    fn(undefined, file)
  }).catch(function (err) {
    fn(err)
  })
}
