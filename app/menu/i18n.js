const en = {
  source: 'This work was provided by',
  learnMore: 'Learn more about it.',
  updating: 'Updating...',
  about: 'About',
  quit: 'Quit'
}

const es = {
  source: 'Fuente de ilustraciones:',
  learnMore: 'Aprende más',
  updating: 'Actualizando...',
  about: 'Información',
  quit: 'Dejar'
}

const de = {
  source: 'Kunstwerk Quelle',
  learnMore: 'Mehr erfahren',
  updating: 'Aktualisierung...',
  about: 'Information',
  quit: 'Verlassen'
}

const zh = {
  source: '艺术品来源',
  learnMore: '学到更多',
  updating: '更新',
  about: '信息',
  quit: '放弃'
}

function i18n (locale) {
  if (locale.indexOf('en') > -1) return en
  if (locale.indexOf('es') > -1) return es
  if (locale.indexOf('zh') > -1) return zh
  if (locale.indexOf('de') > -1) return de
}

module.exports = i18n
