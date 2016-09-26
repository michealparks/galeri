const React = require('react')
const classnames = require('classnames')

const BackgroundImage = ({ images, positions, i }) => (
  <div className='background'>
    <div
      className={ classnames(`bg-image bg-image--${positions[0]}`, { 'bg-image--active': i === 0 }) }
      style={{ backgroundImage: `url("${images[0]}")` }} />
    <div
      className={ classnames(`bg-image bg-image--${positions[1]}`, { 'bg-image--active': i === 1 }) }
      style={{ backgroundImage: `url("${images[1]}")` }} />
  </div>
)

module.exports = BackgroundImage
