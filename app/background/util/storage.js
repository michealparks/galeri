module.exports = storage

const hasStorage = (() => {
  try {
    localStorage.setItem('__test__', '__test__')
    localStorage.removeItem('__test__')
    return true
  } catch (e) {
    return false
  }
})()

function storage (key, val) {
  if (!hasStorage) return

  if (val !== undefined) {
    return localStorage.setItem(key, JSON.stringify(val))
  } else {
    return JSON.parse(localStorage.getItem(key))
  }
}
