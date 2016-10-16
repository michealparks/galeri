// const appConfig = require('application-config')('WebTorrent')
const path = require('path')
// const electron = require('electron')
// const arch = require('arch')

const APP_NAME = 'Galeri'
const APP_TEAM = 'Space Egg, LLC'
const APP_VERSION = require('../../package.json').version

module.exports = {
  AUTO_UPDATE_URL: 'https://galeri.io/update',
  CRASH_REPORT_URL: 'https://galeri.io/crash-report',
  TELEMETRY_URL: 'https://galeri.io/telemetry',

  GITHUB_URL: 'https://github.com/michealparks/galeri',
  GITHUB_URL_ISSUES: 'https://github.com/michealparks/galeri/issues',
  GITHUB_URL_RAW: 'https://raw.githubusercontent.com/michealparks/galeri/master',

  HOME_PAGE_URL: 'https://webtorrent.io',

  APP_COPYRIGHT: 'Copyright © 2014-2016 ' + APP_TEAM,
  APP_ICON: path.join(__dirname, '..', 'static', 'Galeri'),
  APP_NAME: APP_NAME,
  APP_TEAM: APP_TEAM,
  APP_VERSION: APP_VERSION,
  APP_WINDOW_TITLE: APP_NAME + ' (BETA)',

  ROOT_PATH: path.join(__dirname, '../..'),
  STATIC_PATH: path.join(__dirname, '../..', 'static')
}
