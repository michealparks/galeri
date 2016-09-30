const React = require('react')
const classnames = require('classnames')

const BackgroundImage = ({ img_0, img_1, pos_0, pos_1, i }) => (
  <div className='background'>
    <div
      className={ classnames(`bg-image bg-image--${pos_0}`, { 'bg-image--active': i === 0 }) }
      style={ img_0 !== ''
        ? { backgroundImage: `url("${img_0}")` }
        : {}
      } />
    <div
      className={ classnames(`bg-image bg-image--${pos_1}`, { 'bg-image--active': i === 1 }) }
      style={ img_1 !== ''
        ? { backgroundImage: `url("${img_1}")` }
        : {} } />
  </div>
)

module.exports = BackgroundImage
