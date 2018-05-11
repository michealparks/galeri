module.exports = parseHTML

const parser = new window.DOMParser()

function parseHTML (html) {
  return parser.parseFromString(html, 'text/html').documentElement
}
