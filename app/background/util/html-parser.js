const parser = new window.DOMParser()

export default (html) => {
  return parser.parseFromString(html, 'text/html').documentElement
}
