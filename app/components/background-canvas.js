const React = require('react')
const classnames = require('classnames')

const BackgroundImage = ({ i }) => (
  <div className='background'>
    <canvas
      id='canvas_0'
      className={ classnames(`bg-image`, { 'bg-image--active': i === 0 }) } />
    <canvas
      id='canvas_1'
      className={ classnames(`bg-image`, { 'bg-image--active': i === 1 }) } />
  </div>
)

module.exports = BackgroundImage
