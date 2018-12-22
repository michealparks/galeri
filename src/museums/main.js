import {getWikipedia} from './wikipedia'
import {getRijks} from './rijks'

const getters = [
  getWikipedia,
  getRijks
]

export function getArtwork (cb) {
  const rand = Math.random () * getters.length | 0
  return getters[rand](cb)
}
