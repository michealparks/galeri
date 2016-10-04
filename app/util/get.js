const { get } = require('https')
const { parse } = require('url')

const headers = {
  'cache-control': 'no-cache, no-store',
  'pragma-directive': 'no-cache',
  'cache-directive': 'no-cache',
  'pragma': 'no-cache',
  'expires': '0'
}

const _get = (url, callback, { hostname, path } = parse(url)) => get({
  headers,
  hostname,
  path
}, res => {
  if (res.statusCode === 301) {
    return _get(res.headers.location, callback)
  }

  if (res.statusCode !== 200) callback(res.statusCode)

  let body = ''

  res.on('data', d => { body += d })
  res.on('error', callback)
  res.on('end', () => callback(null, body))
}).on('error', callback)

_get.headers = headers

module.exports = _get
