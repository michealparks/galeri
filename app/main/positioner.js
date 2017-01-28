const { screen } = require('electron')

function getPosition (location, trayPosition, screenSize, windowSize) {
  switch (location) {
    case 'trayCenter': return {
      x: Math.floor(trayPosition.x - ((windowSize[0] / 2)) + (trayPosition.width / 2)),
      y: screenSize.y
    }
    case 'trayBottomCenter': return {
      x: Math.floor(trayPosition.x - ((windowSize[0] / 2)) + (trayPosition.width / 2)),
      y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
    }
    case 'topRight': return {
      x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
      y: screenSize.y
    }
    case 'bottomRight': return {
      x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
      y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
    }
  }
}

function calculatePosition (browserWindow, position, trayPosition) {
  const screenSize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea
  const windowSize = browserWindow.getSize()
  const basePosition = getPosition(position, trayPosition || {}, screenSize, windowSize)

  // Default to right if the window is bigger than the space left.
  // Because on Windows the window might get out of bounds and dissappear.
  if (position.substr(0, 4) === 'tray' &&
     (basePosition.x + windowSize[0]) > (screenSize.width + screenSize.x)) {
    return {
      x: getPosition('topRight', trayPosition || {}, screenSize, windowSize).x,
      y: basePosition.y
    }
  }

  return basePosition
}

module.exports = calculatePosition
