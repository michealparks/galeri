const canvas = document.getElementsByClassName('bg-image')
const description = document.querySelector('.description')
const title = description.children[0]
const text = description.children[1]

const App = props => {
  const i = props.activeIndex
  canvas[i].classList.add('bg-image--active')
  canvas[(i + 1) % 2].classList.remove('bg-image--active')
  description.className = `description${props.descriptionPosition === 'left'
      ? ' description--left'
      : props.descriptionPosition === 'bottom'
      ? ' description--bottom'
      : ''}${props.shouldDescriptionAnimate ? '' : ' no-transition'}`

  title.textContent = props.title
  text.textContent = props.text
}

module.exports = App
