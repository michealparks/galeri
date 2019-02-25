import {getWikipedia} from './wikipedia.js'
import {getRijks} from './rijks.js'
import {getMet} from './met.js'

const getters = [
  getWikipedia,
  getRijks,
  getMet
]

export function getArtwork (cb) {
  const rand = Math.random () * getters.length | 0
  return getters[rand](cb)
}
