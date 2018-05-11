const {createWriteStream} = require('fs')
const {head, get} = require('request')

module.exports = (url, filename, next) => (
  head(url, (err, res, body) => {
    if (err || res.headers['content-type'] === 'text/html') {
      return next(err || 'incorrect content type')
    }

    console.log('content-type:', res.headers['content-type'])
    console.log('content-length:', res.headers['content-length'])

    get(url)
      .on('error', (err) => next(err))
      .pipe(createWriteStream(filename).on('error', (err) => next(err)))
      .on('close', () => next())
  })
)
