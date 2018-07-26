const hasStorage = (() => {
  try {
    localStorage.setItem('__test__', '__test__')
    localStorage.removeItem('__test__')
    return true
  } catch (e) {
    return false
  }
})()

export default (key, val) => {
  if (!hasStorage) return

  if (val !== undefined) {
    return localStorage.setItem(key, JSON.stringify(val))
  } else {
    return JSON.parse(localStorage.getItem(key))
  }
}
