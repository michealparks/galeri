module.exports = {screenWidth, screenHeight}

const {clamp} = require('./index')

function screenWidth () {
  return clamp(window.innerWidth * window.devicePixelRatio, 0, 2200) - 400
}

function screenHeight () {
  return clamp(window.innerHeight * window.devicePixelRatio, 0, 2200) - 400
}
