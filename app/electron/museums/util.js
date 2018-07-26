import electron from 'electron'

export const clamp = (n, min, max) => {
  return Math.min(Math.max(n, min), max)
}

export const getScreenSize = () => {
  const {width, height} = electron.screen.getPrimaryDisplay().size

  return {
    width: clamp(width, 0, 2200) - 400,
    height: clamp(height, 0, 2000) - 400
  }
}

// Pretty standard modern Fischer-Yates algorithm
export const shuffle = (array) => {
  for (let i = array.length - 1, j, t; i > 0; --i) {
    j = Math.floor(Math.random() * (i + 1))
    t = array[i]
    array[i] = array[j]
    array[j] = t
  }

  return array
}
