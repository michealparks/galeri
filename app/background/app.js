const React = require('react')
const BackgroundCanvas = require('../components/background-canvas')
const Description = require('../components/description')

const App = props => (
  <div>
    <BackgroundCanvas
      i={ props.activeIndex } />
    <Description
      __html={ props.description }
      position={ props.descriptionPosition }
      shouldAnimate={ props.shouldDescriptionAnimate } />
  </div>
)

module.exports = App
