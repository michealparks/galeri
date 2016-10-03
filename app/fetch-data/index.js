const config = require('application-config')('galeri_images')

const { provideWikipediaConfig, getNextWikipediaImage } = require('./wikipedia')
const { provideRijksMuseumConfig, getNextRijksMuseumImage } = require('./rijksmuseum')

let srcRotator = 0

let defaultConfig = {
  wikipedia: {
    timestamp: null,
    results: []
  },
  rijksMuseum: {
    page: 0,
    results: []
  }
}

// TODO set timeout to update image array
const getNextImage = callback => {
  switch (++srcRotator % 2) {
    case 0:
      return getNextWikipediaImage(callback)
    case 1:
      return getNextRijksMuseumImage(callback)
  }
}

const init = () => {
  config.read((err, data) => {
    if (err || Object.keys(data).length === 0) data = defaultConfig

    const write = config.write.bind(config)

    provideWikipediaConfig(data.wikipedia, write)
    provideRijksMuseumConfig(data.rijksMuseum, write)
  })
}

if (process.env.NODE_ENV === 'development') {
  config.trash(init)
} else {
  init()
}

module.exports = getNextImage
