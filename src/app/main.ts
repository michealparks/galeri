import '../index.css'
import App from './App.svelte'

const target = document.getElementById('app')

if (!target) {
  throw new Error('Target is undefined')
}

export default new App({ target })
