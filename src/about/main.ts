import App from './App.svelte'

const target = document.getElementById('app')

if (target === null) {
	throw new Error()
}

export default new App({ target })
