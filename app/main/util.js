module.exports = {getUrl}

const {format} = require('url')
const {resolve} = require('path')

function getUrl (name) {
  return format({
    protocol: 'file',
    slashes: true,
    pathname: resolve(__dirname, __dev__ ? 'app' : 'build', name + '.html')
  })
}
