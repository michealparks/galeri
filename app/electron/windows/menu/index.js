import electron, {
  systemPreferences,
  BrowserWindow,
  Tray
} from 'electron'

import {
  APP_ICON,
  TRAY_ICON,
  TRAY_ICON_DARK
} from '../../../../config'

import {calculatePosition} from './positioner'
import {getUrl} from '../../../util'

export let menuWindow
export let tray

if (systemPreferences.subscribeNotification !== undefined) {
  systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    () => tray && tray.setImage(getIconUrl()))
}

const getIconUrl = () => {
  return systemPreferences.isDarkMode() || __linux__
    ? TRAY_ICON_DARK
    : TRAY_ICON
}

const showWindow = (bounds) => {
  tray.setHighlightMode('always')

  if (menuWindow === undefined) makeWindow()

  const [x, y] = calculatePosition(
    electron.screen,
    menuWindow.getSize(),
    bounds)

  menuWindow.setPosition(x, y + (__win32__ ? 0 : 5))
  menuWindow.show()
}

const hideWindow = () => {
  tray.setHighlightMode('never')
  menuWindow.hide()
}

const onClick = (e, bounds) => {
  return menuWindow.isVisible()
    ? hideWindow()
    : showWindow(bounds)
}

const makeWindow = () => {
  if (menuWindow !== undefined) {
    return menuWindow.focus() && menuWindow.restore()
  }

  menuWindow = new BrowserWindow({
    title: 'Galeri',
    icon: APP_ICON,
    alwaysOnTop: __dev__,
    resizable: false,
    transparent: true,
    skipTaskbar: !__linux__,
    thickFrame: false,
    show: false,
    frame: false,
    width: 250,
    height: 320,
    webPreferences: {
      webAudio: false,
      webgl: false
    }
  })

  menuWindow.setVisibleOnAllWorkspaces(true)
  menuWindow.setMenuBarVisibility(false)

  if (__dev__) menuWindow.openDevTools({mode: 'detach'})

  menuWindow.once('ready-to-show', menuWindow.show)
  menuWindow.on('close', () => { menuWindow = undefined })
  menuWindow.on('blur', hideWindow)

  return menuWindow.loadURL(getUrl('menubar'))
}

export const menu = () => {
  tray = new Tray(getIconUrl())
  tray.on('click', onClick)
  tray.on('double-click', onClick)

  return makeWindow()
}
