const config = require('application-config')('Galeri')
const { minutes } = require('../util/time')

const baseConfig = {
  version: 'v0.0.3',
  refreshRate: minutes(30),
  showTextOnDesktop: true,
  autolaunch: true
}

let queue = []
let didInit = false
let cache

config.read(onRead)

function onRead (err, data) {
  didInit = true
  cache = data

  if (err || !cache || Object.keys(cache).length === 0 || !cache.version) {
    cache = baseConfig
    config.write(baseConfig)
  }

  if (queue.length) return queue.forEach(fn => fn(cache))
}

function get (next) {
  if (didInit) return next(cache)

  return queue.push(next)
}

module.exports = { get }
