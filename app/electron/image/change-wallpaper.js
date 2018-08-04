import runAppleScript from 'run-applescript'
import wallpaper from 'wallpaper'
import {resolve} from 'path'

const darwinSet = async (imgPath) => {
  try {
    const success = await runAppleScript(`
      tell application "System Events"
        set pictures folder of every desktop to "${imgPath}"
        set picture rotation of every desktop to 1
        delay 1
        set change interval of every desktop to 1
      end tell
    `)
    return success
  } catch (err) {
    console.error('darwinSet() error: ', err)
  }
}

const winSet = async (imgPath, filename) => {
  try {
    const success = await wallpaper.set(resolve(imgPath, filename))
    return success
  } catch (err) {
    console.error('winSet() error: ', err)
  }
}

const set = __darwin__ ? darwinSet : winSet

export const changeWallpaper = (imgPath, filename) => {
  return set(imgPath, filename)
}
