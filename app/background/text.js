const descriptionEl = document.getElementById('description')
const descriptionCL = descriptionEl.classList
const titleEl = descriptionEl.children[0]
const textEl = descriptionEl.children[1]

let title, text

function onTextHide () {
  descriptionCL.add('description--bottom')
}

function onTextReplace () {
  titleEl.textContent = title
  textEl.textContent = text
  descriptionCL.add('no-transition', 'description--left')
  descriptionCL.remove('description--bottom')
}

function onTextShow () {
  descriptionCL.remove('no-transition', 'description--left')
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
  descriptionCL.toggle('description--invisible', !isVisible)
}

module.exports = {
  toggleTextVisibility,
  startTextLifecycle
}
