import {getWikipedia} from './wikipedia'
import {getRijks} from './rijks'
import {getMet} from './met'

const getters = [
  getWikipedia,
  getRijks,
  getMet
]

export function getArtwork (cb) {
  const rand = Math.random () * getters.length | 0
  return getters[rand](cb)
}
