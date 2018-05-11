const electron = require('electron')

let screen

electron.app.once('ready', () => {
  screen = electron.screen
})

const calculatePosition = (w, h, pos, traypos) => {
  const screenSize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea
  const basePosition = getPosition(pos, traypos || {}, screenSize, w, h)

  // Default to right if the window is bigger than the space left.
  // Because on Windows the window might get out of bounds and dissappear.
  if (pos.substr(0, 4) === 'tray' &&
     (basePosition[0] + w) > (screenSize.width + screenSize.x)) {
    return [
      getPosition('topRight', traypos || {}, screenSize, w, h)[0],
      basePosition[1]
    ]
  }

  return basePosition
}

const getPosition = (loc, traypos, screenSize, w, h) => {
  const trayIconWidth = traypos.width || 30

  switch (loc) {
    case 'trayCenter':
      return [
        Math.floor(traypos.x - ((w / 2)) + (trayIconWidth / 2)),
        screenSize.y
      ]
    case 'trayBottomCenter':
      return [
        Math.floor(traypos.x - ((w / 2)) + (trayIconWidth / 2)),
        Math.floor(screenSize.height - (h - screenSize.y))
      ]
    case 'topRight':
      return [
        Math.floor(screenSize.x + (screenSize.width - w)),
        screenSize.y
      ]
    case 'bottomRight':
      return [
        Math.floor(screenSize.x + (screenSize.width - w)),
        Math.floor(screenSize.height - (h - screenSize.y))
      ]
  }
}

module.exports = calculatePosition
