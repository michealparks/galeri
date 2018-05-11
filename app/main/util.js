const {format} = require('url')
const {resolve} = require('path')

const getUrl = (name) => format({
  protocol: 'file',
  slashes: true,
  pathname: resolve(__dirname, __dev__ ? 'app' : 'build', name + '.html')
})

module.exports = {getUrl}
