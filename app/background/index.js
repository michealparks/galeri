const React = require('react')
const { AppContainer } = require('react-hot-loader')
const { render } = require('react-dom')
const root = document.querySelector('#root')

const update = NextApp => render(
  <AppContainer>
    <NextApp />
  </AppContainer>,
  root
)

update(require('./app'))

if (module.hot) {
  module.hot.accept('./app', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    update(require('./app'))
  })
}
