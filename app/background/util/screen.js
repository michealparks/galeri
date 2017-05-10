module.exports = {screenWidth, screenHeight}

function screenWidth () {
  return clamp(window.innerWidth * window.devicePixelRatio, 0, 2200) - 400
}

function screenHeight () {
  return clamp(window.innerHeight * window.devicePixelRatio, 0, 2200) - 400
}

function clamp (n, min, max) {
  return Math.min(Math.max(n, min), max)
}
