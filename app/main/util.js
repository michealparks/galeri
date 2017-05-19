module.exports = {getUrl}

const __dev__ = process.env.NODE_ENV === 'development'
const {format} = require('url')
const {resolve} = require('path')

function getUrl (name) {
  return format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, __dev__ ? '..' : 'build', name + '.html')
  })
}
