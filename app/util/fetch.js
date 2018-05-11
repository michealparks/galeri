const http = require('http')
const https = require('https')
const {parse} = require('url')

const tryParse = (json) => {
  try {
    return [undefined, JSON.parse(json)]
  } catch (err) {
    return [err, undefined]
  }
}

module.exports = (url, next, responseType) => {
  const opts = parse(url)
  let {get} = (opts.protocol === 'https:' ? https : http)
  opts.port = opts.protocol === 'https:' ? 443 : 80

  console.log(url)

  get(opts, (res) => {
    if (res.statusCode !== 200) {
      res.resume()
      return next(new Error('Request Failed.\n' + `Status Code: ${res.statusCode}`))
    }

    let body = responseType === 'buffer' ? Buffer.from([]) : ''

    res.on('error', (err) => {
      next(err)
    }).on('data', (data) => {
      if (responseType === 'buffer') {
        body = Buffer.concat([body, data])
      } else {
        body += data
      }
    }).on('end', () => {
      if (responseType === 'buffer') {
        return next(undefined, body)
      }

      const [err, parsed] = tryParse(body)
      next(err, parsed)
    })
  }).on('error', err => next(err))
}
