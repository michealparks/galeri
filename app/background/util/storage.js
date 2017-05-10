module.exports = {get, set}

const hasStorage = (() => {
  try {
    localStorage.setItem('__test__', '__test__')
    localStorage.removeItem('__test__')
    return true
  } catch (e) {
    return false
  }
})()

function get (key) {
  return hasStorage ? JSON.parse(localStorage.getItem(key)) : undefined
}

function set (key, val) {
  return hasStorage ? localStorage.setItem(key, JSON.stringify(val)) : undefined
}
