const config = require('application-config')('Galeri')
const { ipcMain } = require('electron')
const { minutes } = require('../util/time')
const path = require('path')
const { hours } = require('../util/time')
// const arch = require('arch')

const APP_NAME = 'Galeri'
const APP_TEAM = 'Space Egg, LLC'
const APP_VERSION = require('../../package.json').version

module.exports = {
  HOME_PAGE_URL: 'https://galeri.io',
  AUTO_UPDATE_URL: 'https://galeri.io/update',
  CRASH_REPORT_URL: 'https://galeri.io/crash-report',
  TELEMETRY_URL: 'https://galeri.io/telemetry',

  GITHUB_URL: 'https://github.com/michealparks/galeri-www',
  GITHUB_URL_ISSUES: 'https://github.com/michealparks/galeri-www/issues',
  GITHUB_URL_RAW: 'https://raw.githubusercontent.com/michealparks/galeri-www/master',
  GITHUB_RELEASE_API: 'https://api.github.com/repos/michealparks/galeri-www/releases/latest',

  APP_NAME,
  APP_TEAM,
  APP_VERSION,
  APP_COPYRIGHT: 'Copyright © 2016 ' + APP_TEAM,
  APP_ICON: path.join(__dirname, '../..', 'assets', 'Galeri'),

  ROOT_PATH: path.join(__dirname, '../..'),
  STATIC_PATH: path.join(__dirname, '../..', 'assets'),

  CHECK_UPDATE_INTERVAL: hours(24)
}

const baseConfig = {
  version: 'v0.0.3',
  refreshRate: minutes(30),
  showTextOnDesktop: true,
  autolaunch: true
}

config.read((err, data) => {
  if (!err && data && Object.keys(data).length > 0 && data.version) return

  return config.write(baseConfig)
})

ipcMain.on('preferences', (e, data) => config.write(data))
