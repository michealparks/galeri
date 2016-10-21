function Positioner (browserWindow) {
  this.browserWindow = browserWindow
  this.screen = require('electron').screen
}

Positioner.prototype.calculate = function (position, trayPosition = {}) {
  let screenSize = this.screen.getDisplayNearestPoint(this.screen.getCursorScreenPoint()).workArea
  let windowSize = this.browserWindow.getSize()

  // Positions
  let positions = {
    trayCenter: {
      x: Math.floor(trayPosition.x - ((windowSize[0] / 2)) + (trayPosition.width / 2)),
      y: screenSize.y
    },
    trayBottomCenter: {
      x: Math.floor(trayPosition.x - ((windowSize[0] / 2)) + (trayPosition.width / 2)),
      y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
    },
    topRight: {
      x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
      y: screenSize.y
    },
    bottomRight: {
      x: Math.floor(screenSize.x + (screenSize.width - windowSize[0])),
      y: Math.floor(screenSize.height - (windowSize[1] - screenSize.y))
    }
  }

  // Default to right if the window is bigger than the space left.
  // Because on Windows the window might get out of bounds and dissappear.
  if (position.substr(0, 4) === 'tray') {
    if ((positions[position].x + windowSize[0]) > (screenSize.width + screenSize.x)) {
      return {
        x: positions['topRight'].x,
        y: positions[position].y
      }
    }
  }

  return positions[position]
}

module.exports = Positioner
