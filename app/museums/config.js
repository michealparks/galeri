module.exports = {
  met_acrylic: {
    type: 'acrylic on canvas',
    get: require('./met'),
    artworks: [],
    isPaginated: true,
    pages: [0],
    perPage: 20
  },
  met_oil: {
    type: 'oil on canvas',
    get: require('./met'),
    artworks: [],
    isPaginated: true,
    pages: [0],
    perPage: 20
  },
  rijks_painting: {
    type: 'type=painting',
    get: require('./rijks'),
    artworks: [],
    isPaginated: true,
    pages: [0],
    perPage: 30
  },
  wikipedia: {
    type: 'Paintings',
    get: require('./wikipedia'),
    artworks: [],
    isPaginated: false,
    pages: []
  }
}
