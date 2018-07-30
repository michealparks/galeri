import {format} from 'url'
import {resolve} from 'path'
import electron from 'electron'
import _fetch from 'node-fetch'

export const clamp = (n, min, max) => {
  return Math.min(Math.max(n, min), max)
}

export const getUrl = (name) => format({
  protocol: 'file',
  slashes: true,
  pathname: resolve(__dirname, 'app', name + '.html')
})

const fetchOpts = {
  timeout: 10000,
  headers: {'User-Agent': 'galeri'}
}

export const fetch = async (url) => {
  try {
    const res = await _fetch(url, fetchOpts)

    if (res.status !== 200) {
      throw new Error(`fetch error: `, res.status, res)
    }

    return res
  } catch (err) {
    if (__dev__) console.error('fetch error: ', err)
  }
}

export const fetchJSON = async (url) => {
  try {
    const res = await _fetch(url, fetchOpts)

    if (res.status !== 200) {
      throw new Error(`fetch error: `, res.status, res)
    }

    const json = await res.json()
    return json
  } catch (err) {
    if (__dev__) console.error('fetch error: ', err)
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

export const getScreenSize = () => {
  const {width, height} = electron.screen.getPrimaryDisplay().size

  return {
    width: clamp(width, 0, 2000),
    height: clamp(height, 0, 2000)
  }
}
