const React = require('react')
const { shouldComponentUpdate } = require('react-addons-pure-render-mixin')
const { ipcRenderer, remote } = require('electron')
const BackgroundImage = require('../components/background-image')
const Description = require('../components/description')
const { session } = remote.getCurrentWindow().webContents

let getNextImage

require('../fetch-data')(fn => { getNextImage = fn })

class App extends React.Component {
  constructor (props) {
    super(props)

    this._imageRefreshRate = 10000 // 1000 * 60 * 60
    this._updateTimerId = 0
    this._didDescriptionUpdate = false
    this._newDescription = ''
    this._descriptionLifeCycle = 0

    this.state = {
      i: 0,
      images: ['', ''],
      positions: ['', ''],
      description: '',
      descriptionPosition: 'left',
      shouldDescriptionAnimate: true
    }

    this.shouldComponentUpdate = shouldComponentUpdate.bind(this)

    const onOnlineStatusChange = () => navigator.onLine
      ? this.updateImage()
      : clearTimeout(this._updateTimerId)

    window.addEventListener('online', onOnlineStatusChange)
    window.addEventListener('offline', onOnlineStatusChange)

    // listen for requests for next image
    ipcRenderer.on('next-image-request', () => {
      clearTimeout(this._updateTimerId)
      this.updateImage()
    })

    // cancel any data fetching if the computer is suspended
    ipcRenderer.on('suspend', () => clearTimeout(this._updateTimerId))

    // resume image fetching when awakened
    ipcRenderer.on('resume', () => this.updateImage())
  }

  updateImage () {
    if (!getNextImage) return setTimeout(() => this.updateImage(0), 100)

    session.getCacheSize(console.log.bind(console))
    let count = 0
    session.clearCache(() =>
      ++count === 2 ? getNextImage().then(this.onImageFetch) : null)
    session.clearStorageData({}, () =>
      ++count === 2 ? getNextImage().then(this.onImageFetch) : null)
  }

  componentDidMount () {
    this.onImageFetch = this.onImageFetch.bind(this)
    this.updateImage()
  }

  onImageFetch ({ img, content, position }) {
    let { images, positions, i } = this.state

    i = ++i % 2
    images[i] = img
    positions[i] = position

    this._newDescription = content
    this.setState({
      i,
      images,
      positions,
      descriptionPosition: 'bottom'
    })

    this._updateTimerId = setTimeout(() =>
      this.updateImage(), this._imageRefreshRate)
  }

  componentDidUpdate () {
    switch (this._descriptionLifeCycle) {
      case 0:
        ++this._descriptionLifeCycle
        return setTimeout(() => this.setState({
          description: this._newDescription,
          shouldDescriptionAnimate: false,
          descriptionPosition: 'left'
        }), 800)
      case 1:
        ++this._descriptionLifeCycle
        return setTimeout(() => this.setState({
          descriptionPosition: '',
          shouldDescriptionAnimate: true
        }), 150)
      default:
        this._descriptionLifeCycle = 0
    }
  }

  render () {
    const { state } = this

    return (
      <div>
        <BackgroundImage
          i={ state.i }
          positions={ state.positions }
          images={ state.images } />
        <Description
          __html={ state.description }
          position={ state.descriptionPosition }
          shouldAnimate={ state.shouldDescriptionAnimate } />
      </div>
    )
  }
}

module.exports = App
