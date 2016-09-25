const React = require('react')

const BackgroundImage = ({ images, active }) => (
  <div className='background'>
    <div className='background__image' style={{
      backgroundImage: `url("${images[0]}")`,
      opacity: active === 0 ? 1 : 0
    }} />
    <div className='background__image' style={{
      backgroundImage: `url("${images[1]}")`,
      opacity: active === 1 ? 1 : 0
    }} />
  </div>
)

module.exports = BackgroundImage
