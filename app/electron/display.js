import {imageWindow} from './windows/image'

let screen

export const windows = []

export const handleDisplayChanges = (ref) => {
  screen = ref

  screen.on('display-added', onDisplayAdded)
  screen.on('display-removed', onDisplayRemoved)
  screen.on('display-metrics-changed', onDisplayMetricsChanged)

  const displays = screen.getAllDisplays()

  for (let i = 0, l = displays.length; i < l; i++) {
    windows.push(imageWindow(displays[i]))
  }
}

const findWindowIndexOfDisplay = (display) => {
  for (let i = 0, l = windows.length; i < l; i++) {
    if (windows[i].display.id === display.id) {
      return i
    }
  }
}

const onDisplayAdded = (e, newDisplay) => {
  windows.push(imageWindow(newDisplay))
}

const onDisplayRemoved = (e, oldDisplay) => {
  const i = findWindowIndexOfDisplay(oldDisplay)

  windows[i].destroy()
  windows.splice(i, 1)
}

const onDisplayMetricsChanged = (e, display) => {
  const i = findWindowIndexOfDisplay(display)

  windows[i].setBounds(display.bounds, false)
}
