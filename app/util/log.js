function noop () {}

const prod = process.env.NODE_ENV === 'production'
const log = prod ? noop : console.log.bind(console)
const warn = prod ? noop : console.warn.bind(console)
const error = prod ? noop : console.error.bind(console)

module.exports = { log, warn, error }
