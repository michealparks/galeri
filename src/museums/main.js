import {getWikipedia} from './wikipedia.js'
import {getRijks} from './rijks.js'

const getters = [
  getWikipedia,
  getRijks
]

export function getArtwork (cb) {
  const rand = Math.random () * getters.length | 0
  return getters[rand](cb)
}
