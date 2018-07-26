import electron from 'electron'
import i18n from './i18n'

let getLocale
let currentLocale = 'en'

const checkLocale = () => {
  if (!getLocale) {
    getLocale = electron.remote.app.getLocale
  }

  const locale = getLocale()

  if (locale.indexOf(currentLocale) > -1) return

  currentLocale = locale

  if (locale.indexOf('en') === -1) {
    const lang = i18n(locale)

    if (lang) {
      const $ = document.getElementById.bind(document)
      $('text-source').textContent = lang.source
      $('text-learn').textContent = lang.learnMore
      $('text-about').textContent = lang.about
      $('text-quit').textContent = lang.quit
    }
  }
}

setInterval(checkLocale, 1000 * 60)
