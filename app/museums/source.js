const fetchImage = require('../util/fetch-image')
const imageFilename = require('../util/image-filename')

class Source {
  constructor ({type, artworks, start, pages, perPage}) {
    this.type = type
    this.artworks = artworks || []
    this.pages = pages || []
    this.page = start || 0
    this.perPage = perPage
    this.onFinish = null
  }

  shuffle (array) {
    for (let i = array.length - 1, j, t; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      t = array[i]
      array[i] = array[j]
      array[j] = t
    }
  }

  getArtwork () {
    return this.artworks.pop()
  }

  fetch (next) {
    this.onFinish = next
    fetch(this.url(), (err, res) => this.onGetArtwork(err, res))
  }

  getPages (count) {
    const total = Math.ceil(count / this.perPage)

    for (let i = this.start; i < total; i += 1) {
      if (i !== this.page) this.pages.push(i)
    }

    this.shuffle(this.pages)
  }

  onFetch (count) {
    if (this.pages.length === 0) {
      this.pages = this.getPages(count)
    }

    this.art = this.artworks.pop()

    this.shuffle(this.artworks)
    this.download(this.art)
  }

  download ({title, text, imgsrc}) {
    this.art.localsrc = imageFilename(title, text, imgsrc)

    fetchImage(imgsrc, this.art.localsrc, this.onDownload)
  }

  onDownload (err) {

  }
}

module.exports = Source
