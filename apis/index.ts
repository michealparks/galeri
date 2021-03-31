import { wikipedia } from './wikipedia'
import { rijks } from './rijks'
import { met } from './met'
import { blacklist } from './blacklist'
import { store } from './store'

import type { Artwork } from './types'

const api = [
  rijks,
  wikipedia,
  met
]

const init = () => {
  store.set('wikipedia', store.get('wikipedia') || [])
  store.set('rijks', store.get('rijks') || [])
  store.set('met', store.get('met') || [])
}

const get = async (forceNext = false): Promise<Artwork> => {
  let current = store.get('current') as Artwork | undefined
  let next = store.get('next') as Artwork | undefined

  if (current === undefined || forceNext) {
    if (next === undefined) {
      current = await getArtwork()
    } else {
      current = next
      next = undefined
    }
  }

  store.set('current', current)

  if (next === undefined) {
    next = await getArtwork()

    store.set('next', next)
  }

  return current
}

const getRandom = (): Promise<Artwork | undefined> => {
  return api[Math.floor(Math.random() * api.length)].randomArtwork()
}

const getArtwork = async (): Promise<Artwork> => {
  const artwork = await getRandom()

  if (artwork === undefined) {
    return getArtwork()
  }

  if (blacklist.includes(decodeURI(artwork.src))) {
    return getArtwork()
  }

  return artwork
}

export const apis = {
  init,
  get
}