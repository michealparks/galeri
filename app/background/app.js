const React = require('react')
const BackgroundImage = require('../components/background-image')
const Description = require('../components/description')

const App = props => (
  <div>
    <BackgroundImage
      i={ props.index }
      pos_0={ props.pos_0 }
      pos_1={ props.pos_1 }
      img_0={ props.img_0 }
      img_1={ props.img_1 } />
    <Description
      __html={ props.description }
      position={ props.descriptionPosition }
      shouldAnimate={ props.shouldDescriptionAnimate } />
  </div>
)

module.exports = App
