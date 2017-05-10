const {join} = require('path')

module.exports = Object.seal({
  HOME_PAGE_URL: 'https://galeri.io',
  AUTO_UPDATE_URL: 'https://galeri.io/update',
  CRASH_REPORT_URL: 'https://galeri.io/crash-report',
  TELEMETRY_URL: 'https://galeri.io/telemetry',

  GITHUB_URL: 'https://github.com/michealparks/galeri-www',
  GITHUB_URL_ISSUES: 'https://github.com/michealparks/galeri-www/issues',
  GITHUB_URL_RAW: 'https://raw.githubusercontent.com/michealparks/galeri-www/master',
  GITHUB_RELEASE_API: 'https://api.github.com/repos/michealparks/galeri-www/releases/latest',

  APP_NAME: 'Galeri',
  APP_TEAM: 'Space Egg, LLC',
  APP_VERSION: require('../../package.json').version,
  APP_COPYRIGHT: `Copyright © 2016 - ${(new Date()).getFullYear()} Space Egg, LLC`,
  APP_ICON: join(__dirname, '../..', 'assets', 'Galeri'),

  ROOT_PATH: join(__dirname, '../..'),
  STATIC_PATH: join(__dirname, '../..', 'assets'),

  CHECK_UPDATE_INTERVAL: 6 * 1000 * 60 * 60 // 6 hours
})
