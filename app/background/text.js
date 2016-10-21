const { parseHTML } = require('../util/string')
const descriptionEl = document.getElementById('description')
const descriptionCL = descriptionEl.classList
const titleEl = descriptionEl.children[0]
const textEl = descriptionEl.children[1]

let title, text

function onTextHide () {
  return descriptionCL.add('description--bottom')
}

function onTextReplace () {
  // Sometimes titles have ugly HTML entities. * Cough Cough Met Museum *
  titleEl.textContent = parseHTML(title).textContent
  textEl.textContent = text
  descriptionCL.add('no-transition', 'description--left')
  return descriptionCL.remove('description--bottom')
}

function onTextShow () {
  return descriptionCL.remove('no-transition', 'description--left')
}

function startTextLifecycle (data) {
  setTimeout(onTextHide)

  if (data) {
    title = data.title
    text = data.text
    setTimeout(onTextReplace, 800)
    setTimeout(onTextShow, 2500)
  }
}

function toggleTextVisibility (isVisible) {
  return descriptionCL.toggle('description--invisible', !isVisible)
}

module.exports = {
  toggleTextVisibility,
  startTextLifecycle
}
