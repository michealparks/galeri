module.exports = i18n

function i18n (locale) {
  if (locale.indexOf('en') > -1) {
    return {
      source: 'This work was provided by',
      learnMore: 'Learn more about it.',
      updating: 'Updating...',
      about: 'About',
      quit: 'Quit'
    }
  }
  if (locale.indexOf('es') > -1) {
    return {
      source: 'Fuente de ilustraciones:',
      learnMore: 'Aprende más',
      updating: 'Actualizando...',
      about: 'Información',
      quit: 'Dejar'
    }
  }
  if (locale.indexOf('zh') > -1) {
    return {
      source: '艺术品来源',
      learnMore: '学到更多',
      updating: '更新',
      about: '信息',
      quit: '放弃'
    }
  }
  if (locale.indexOf('de') > -1) {
    return {
      source: 'Kunstwerk Quelle',
      learnMore: 'Mehr erfahren',
      updating: 'Aktualisierung...',
      about: 'Information',
      quit: 'Verlassen'
    }
  }
}