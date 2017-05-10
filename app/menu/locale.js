const {getLocale} = require('electron').remote.app
let currentLocale = 'en'

function checkLocale () {
  const locale = getLocale()

  if (locale.indexOf(currentLocale) > -1) return

  currentLocale = locale

  if (locale.indexOf('en') === -1) {
    const lang = require('./i18n')(locale)

    if (lang) {
      const $ = document.getElementById.bind(document)
      $('source__text').textContent = lang.source
      $('learn__text').textContent = lang.learnMore
      $('updating__text').textContent = lang.updating
      $('about__text').textContent = lang.about
      $('quit__text').textContent = lang.quit
    }
  }
}

setInterval(checkLocale, 5000)
