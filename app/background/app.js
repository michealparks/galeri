const React = require('react')
const BackgroundImage = require('../components/background-image')
const Description = require('../components/description')
const onImageFetch = require('../fetch-data')

class App extends React.Component {
  constructor (props) {
    super(props)

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
  }

  componentWillMount () {
    onImageFetch(({ img, content, position }) => {
      let { images, positions, i } = this.state

      i = ++i % 2
      images[i] = img
      positions[i] = position

      this._newDescription = content
      this.setState({ images, positions, i, descriptionPosition: 'bottom' })
    })
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
