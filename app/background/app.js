const React = require('react')
const BackgroundImage = require('../components/background-image')
const onImageFetch = require('../fetch-data')

class App extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      active: 0,
      images: ['', '']
    }
  }

  componentDidMount () {
    onImageFetch(({ img }) => {
      let { images, active } = this.state

      active = ++active % 2
      images[active] = img

      console.log(active)

      this.setState({ images, active })
    })
  }

  render () {
    return (
      <BackgroundImage { ...this.state } />
    )
  }
}

module.exports = App
