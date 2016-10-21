const d = new window.DOMParser()

function parseHTML (html) {
  return d.parseFromString(html, 'text/html').documentElement
}

module.exports = { parseHTML }
