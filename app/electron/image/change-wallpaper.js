import runAppleScript from 'run-applescript'
import wallpaper from 'wallpaper'

export const changeWallpaper = async (imgPath, filename) => {
  let success

  if (__darwin__) {
    success = await darwinSet(imgPath)
  } else if (__win32__ || __linux__) {
    success = await winSet(imgPath, filename)
  }

  return success
}

const darwinSet = (imgPath) => runAppleScript(`
  tell application "System Events"
    set pictures folder of every desktop to "${imgPath}"
    set picture rotation of every desktop to 1
    delay 1
    set change interval of every desktop to 1
  end tell
`)

const winSet = async (imgPath, filename) => {
  let success

  try {
    success = await wallpaper.set(`${imgPath}/${filename}`)
  } catch (err) {
    success = err
  }

  return success
}
