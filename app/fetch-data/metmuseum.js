const { get } = require('http')
const metUrl = 'http://metmuseum.org/api/collection/search?q=oil%20on%20canvas&perPage=20'

const getImagesUrls = (page, callback) => get(`${metUrl}&page=${page}`, res => {
  if (res.statusCode === 301) {
    console.log('301')
    // return getImagesUrls(res.headers.location, callback)
  }

  let body = ''

  res.on('data', d => { body += d })
  res.on('end', () => {
    callback(null, JSON.parse(body))
  })
}).on('error', callback)

getImagesUrls(console.error.bind(console), console.log.bind(console))

