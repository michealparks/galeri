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
    page: 1,
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

config.trash(() => {
  // get stored images
  config.read((err, data) => {
    if (err || Object.keys(data).length === 0) data = defaultConfig

    const write = config.write.bind(config)

    provideWikipediaConfig(data.wikipedia, write)
    provideRijksMuseumConfig(data.rijksMuseum, write)
  })
})

module.exports = getNextImage
