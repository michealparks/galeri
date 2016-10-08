module.exports = require('menubar')({
  index: `file://${__dirname}/app/menubar.html`,
  icon: `${__dirname}/assets/icon_32x32.png`,
  preloadWindow: true,
  showDockIcon: process.env.NODE_ENV === 'development',
  transparent: true,
  show: false,
  width: 250,
  height: 320,
  y: 30
})
