// Pretty standard modern Fischer-Yates algorithm
module.exports = (array) => {
  for (let i = array.length - 1, j, t; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    t = array[i]
    array[i] = array[j]
    array[j] = t
  }

  return array
}
