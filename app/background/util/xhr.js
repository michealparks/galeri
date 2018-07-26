let xhr

export default (url, type) => new Promise((resolve) => {
  xhr = new XMLHttpRequest()

  const errHandler = (next, e) => {
    if (__dev__) console.warn(e)
    resolve()
  }

  xhr.open('GET', url)
  xhr.withCredentials = true
  xhr.responseType = type || 'json'
  xhr.timeout = 10000

  xhr.onload = () => {
    if (xhr.status !== 200 || xhr.response === null) {
      if (__dev__) console.warn(xhr)
      return resolve()
    }

    resolve(xhr.response)
  }

  xhr.ontimeout = errHandler
  xhr.onerror = errHandler
  xhr.send()
})
