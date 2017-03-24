const locale = require('electron').remote.app.getLocale()

if (locale.indexOf('en') === -1) {
  const lang = require('./i18n')(locale)

  if (lang) {
    const sel = document.getElementById.bind(document)

    sel('source__text').textContent = lang.source
    sel('learn__text').textContent = lang.learnMore
    sel('updating__text').textContent = lang.updating
    sel('about__text').textContent = lang.about
    sel('quit__text').textContent = lang.quit
  }
}
