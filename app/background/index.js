const React = require('react')
const { AppContainer } = require('react-hot-loader')
const { render } = require('react-dom')
const App = require('./app')
const root = document.querySelector('#root')

render(
  <AppContainer>
    <App />
  </AppContainer>,
  root
)

if (module.hot) {
  module.hot.accept('./app', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./app')

    render(
      <AppContainer>
        <NextApp />
      </AppContainer>,
      root
    )
  })
}
