const {getLocale} = require('electron').remote.app

let currentLocale = 'en'

const i18n = (locale) => {
  if (locale.indexOf('en') > -1) {
    return {
      source: 'This work was provided by',
      learnMore: 'Learn more about it.',
      about: 'About',
      quit: 'Quit'
    }
  }
  if (locale.indexOf('es') > -1) {
    return {
      source: 'Fuente de ilustraciones:',
      learnMore: 'Aprende más',
      about: 'Información',
      quit: 'Dejar'
    }
  }
  if (locale.indexOf('zh') > -1) {
    return {
      source: '艺术品来源',
      learnMore: '学到更多',
      about: '信息',
      quit: '放弃'
    }
  }
  if (locale.indexOf('de') > -1) {
    return {
      source: 'Kunstwerk Quelle',
      learnMore: 'Mehr erfahren',
      about: 'Information',
      quit: 'Verlassen'
    }
  }
}

const checkLocale = () => {
  const locale = getLocale()

  if (locale.indexOf(currentLocale) > -1) return

  currentLocale = locale

  if (locale.indexOf('en') === -1) {
    const lang = i18n(locale)

    if (lang) {
      window['text-source'].textContent = lang.source
      window['text-learn'].textContent = lang.learnMore
      window['text-about'].textContent = lang.about
      window['text-quit'].textContent = lang.quit
    }
  }

  setTimeout(checkLocale, 10000)
}

checkLocale()
