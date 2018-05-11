module.exports = calculatePosition

function calculatePosition (screen, width, height, position, trayPosition) {
  const screenSize = screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).workArea
  const basePosition = getPosition(position, trayPosition || {}, screenSize, width, height)

  // Default to right if the window is bigger than the space left.
  // Because on Windows the window might get out of bounds and dissappear.
  if (position.substr(0, 4) === 'tray' &&
     (basePosition[0] + width) > (screenSize.width + screenSize.x)) {
    return [
      getPosition('topRight', trayPosition || {}, screenSize, width, height)[0],
      basePosition[1]
    ]
  }

  return basePosition
}

function getPosition (location, trayPosition, screenSize, width, height) {
  const trayIconWidth = trayPosition.width || 30

  switch (location) {
    case 'trayCenter':
      return [
        Math.floor(trayPosition.x - ((width / 2)) + (trayIconWidth / 2)),
        screenSize.y
      ]
    case 'trayBottomCenter':
      return [
        Math.floor(trayPosition.x - ((width / 2)) + (trayIconWidth / 2)),
        Math.floor(screenSize.height - (height - screenSize.y))
      ]
    case 'topRight':
      return [
        Math.floor(screenSize.x + (screenSize.width - width)),
        screenSize.y
      ]
    case 'bottomRight':
      return [
        Math.floor(screenSize.x + (screenSize.width - width)),
        Math.floor(screenSize.height - (height - screenSize.y))
      ]
  }
}
