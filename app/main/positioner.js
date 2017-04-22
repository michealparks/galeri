function getPosition (location, trayPosition, screenSize, windowSize) {
  switch (location) {
    case 'trayCenter':
      return [
        Math.floor(trayPosition.x - ((windowSize[0] / 2)) + (trayPosition.width / 2)),
        screenSize.y
      ]
    case 'trayBottomCenter':
      return [
        Math.floor(trayPosition.x - ((windowSize[0] / 2)) + (trayPosition.width / 2)),
        Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
      ]
    case 'topRight':
      return [
        Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
        screenSize.y
      ]
    case 'bottomRight':
      return [
        Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
        Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
      ]
  }
}

function calculatePosition (screen, browserWindow, position, trayPosition) {
  const screenSize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea
  const windowSize = browserWindow.getSize()
  const basePosition = getPosition(position, trayPosition || {}, screenSize, windowSize)

  console.log(windowSize)

  // Default to right if the window is bigger than the space left.
  // Because on Windows the window might get out of bounds and dissappear.
  if (position.substr(0, 4) === 'tray' &&
     (basePosition[0] + windowSize[0]) > (screenSize.width + screenSize.x)) {
    return [
      getPosition('topRight', trayPosition || {}, screenSize, windowSize)[0],
      basePosition[1]
    ]
  }

  return basePosition
}

module.exports = calculatePosition
