const Source = require('./source')
const parseHTML = require('../util/parse-html')

class Met extends Source {
  url () {
    return 'https://metmuseum.org/api/collection/search' +
      '?q=' + encodeURIComponent(this.type) +
      '&page=' + this.page +
      '&perPage=' + this.perPage
  }

  onGetArtwork (err, response) {
    if (err) return this.onFinish(err)

    const {results = [], totalResults} = response

    for (let i = results.length - 1; i > -1; i -= 1) {
      const {image, title, subTitle, url} = results[i]

      if (!image || !subTitle ||
           image.indexOf('.ashx') > -1 ||
           image.indexOf('NoImageAvailableIcon.png') > -1) continue

      this.artworks.push({
        source: 'The Metropolitan Museum of Art',
        href: `https://metmuseum.org${url}`,
        title: parseHTML(title),
        text: parseHTML(subTitle),
        isFavorited: false,
        imgsrc: (image.indexOf('http') === -1
          ? `http://metmuseum.org/${image}` : image)
          .replace('web-thumb', 'original'),
        localsrc: '',
        width: -1,
        height: -1
      })
    }

    this.onFetch(totalResults)
  }
}

module.exports = Met
