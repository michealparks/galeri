const getPosition = (pos, trayPos, workArea, width, height) => {
  if (pos === 'trayCenter') {
    return [
      (trayPos.x - ((width / 2)) + (trayPos.width / 2)) | 0,
      workArea.y
    ]
  } else if (pos === 'trayBottomCenter') {
    return [
      (trayPos.x - ((width / 2)) + (trayPos.width / 2)) | 0,
      (workArea.height - (height - workArea.y)) | 0
    ]
  } else if (pos === 'topRight') {
    return [
      (workArea.x + (workArea.width - width)) | 0,
      workArea.y
    ]
  } else if (pos === 'bottomRight') {
    return [
      (workArea.x + (workArea.width - width)) | 0,
      (workArea.height - (height - workArea.y)) | 0
    ]
  }
}

export const calculatePosition = (screen, size, bounds) => {
  const [menuWidth, menuHeight] = size

  const pos = (bounds === undefined || bounds.x === 0)
    ? (__win32__ ? 'bottomRight' : 'topRight')
    : (__win32__ ? 'trayBottomCenter' : 'trayCenter')

  const {workArea} = screen.getDisplayNearestPoint(
    screen.getCursorScreenPoint())

  const [x, y] = getPosition(pos, bounds, workArea, menuWidth, menuHeight)

  if (pos.substr(0, 4) === 'tray' && (x + menuWidth) > (workArea.width + workArea.x)) {
    return [
      getPosition('topRight', bounds, workArea, menuWidth, menuHeight)[0],
      y
    ]
  }

  return [x, y]
}
