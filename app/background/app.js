const canvasCL = document.getElementById('canvas_0').classList
const descriptionEl = document.getElementById('description')
const descriptionCL = descriptionEl.classList
const titleEl = descriptionEl.children[0]
const textEl = descriptionEl.children[1]

const App = ({ title, text, activeIndex, descriptionPosition }) => {
  switch (descriptionPosition) {
    case 'left':
      titleEl.textContent = title
      textEl.textContent = text
      descriptionCL.add('no-transition', 'description--left')
      return descriptionCL.remove('description--bottom')
    case 'bottom':
      canvasCL.toggle('bg-image--active', activeIndex === 0)
      return descriptionCL.add('description--bottom')
    default:
      return descriptionCL.remove('no-transition', 'description--left')
  }
}

module.exports = App
