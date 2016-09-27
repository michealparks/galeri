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

    this._i = 0
    this._imageRefreshRate = 10000 // 1000 * 60 * 60
    this._updateTimerId = -1
    this._didDescriptionUpdate = false
    this._newDescription = ''
    this._descriptionLifeCycle = 0

    this.state = {
      img_0: '',
      img_1: '',
      pos_0: '',
      pos_1: '',
      description: '',
      descriptionPosition: 'left',
      shouldDescriptionAnimate: true
    }

    this.shouldComponentUpdate = shouldComponentUpdate.bind(this)
  }

  onOnlineStatusChange () {
    if (navigator.onLine) {
      this._updateTimerId = -1
      this.updateImage()
    } else {
      this._updateTimerId = -2
      clearTimeout(this._updateTimerId)
    }
  }

  componentDidMount () {
    this.onImageFetch = this.onImageFetch.bind(this)
    this.onOnlineStatusChange = this.onOnlineStatusChange.bind(this)

    window.addEventListener('online', this.onOnlineStatusChange)
    window.addEventListener('offline', this.onOnlineStatusChange)

    // cancel any data fetching if the computer is suspended
    ipcRenderer.on('suspend', () => {
      this._updateTimerId = -2
      clearTimeout(this._updateTimerId)
    })
    ipcRenderer.on('next-image-request', this.onOnlineStatusChange)
    ipcRenderer.on('resume', this.onOnlineStatusChange)

    this.onOnlineStatusChange()
  }

  updateImage () {
    if (!getNextImage) return setTimeout(() => this.updateImage(0), 100)

    let count = 0
    const getImg = () => {
      if (++count === 2) {
        getNextImage().then(this.onImageFetch).catch(this.onOnlineStatusChange)
      }
    }

    session.clearCache(getImg)
    session.clearStorageData({}, getImg)
  }

  onImageFetch ({ img, content, position }) {
    this._i = (this._i + 1) % 2
    this._newDescription = content

    this.setState({
      [`img_${this._i}`]: img,
      [`pos_${this._i}`]: position,
      descriptionPosition: 'bottom'
    })

    if (this._updateTimerId === -2) {
      this._updateTimerId = -1
    } else {
      this._updateTimerId = setTimeout(() =>
        this.updateImage(), this._imageRefreshRate)
    }
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
          i={ this._i }
          pos_0={ state.pos_0 }
          pos_1={ state.pos_1 }
          img_0={ state.img_0 }
          img_1={ state.img_1 } />
        <Description
          __html={ state.description }
          position={ state.descriptionPosition }
          shouldAnimate={ state.shouldDescriptionAnimate } />
      </div>
    )
  }
}

module.exports = App
