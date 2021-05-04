import App from './App.svelte'

const target = document.getElementById('app')

if (target === null) {
	throw new Error('App root element is null.')
}

export default new App({ target })
