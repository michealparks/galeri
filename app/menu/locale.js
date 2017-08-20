let getLocale
let currentLocale = 'en'

function checkLocale () {
  if (!getLocale) {
    getLocale = require('electron').remote.app.getLocale
  }

  const locale = getLocale()

  if (locale.indexOf(currentLocale) > -1) return

  currentLocale = locale

  if (locale.indexOf('en') === -1) {
    const lang = require('./i18n')(locale)

    if (lang) {
      const $ = document.getElementById.bind(document)
      $('text-source').textContent = lang.source
      $('text-learn').textContent = lang.learnMore
      $('text-about').textContent = lang.about
      $('text-quit').textContent = lang.quit
    }
  }
}

setInterval(checkLocale, 10000)
