import {resolve} from 'path'
import {makeDir} from '../util/file'
import {appPath} from '../util/app-path'
import {readConfig, writeConfig} from '../util/app-config'

export const state = {
  wallpaperDir: resolve(appPath, 'wallpaper'),
  pendingDir: resolve(appPath, 'pending'),
  favoritesDir: resolve(appPath, 'favorites'),
  updateRateMS: 30000,
  isPaused: false,
  isCurFavorite: false,
  isCyclingFavorites: false,
  favorites: []
}

export const initAppState = async () => {
  await makeDir(state.wallpaperDir)
  await makeDir(state.pendingDir)
  await makeDir(state.favoritesDir)

  const config = await readConfig()

  if (config === undefined) return

  state.updateRateMS = config.updateRateMS
  state.isPaused = config.isPaused
  state.isCurFavorite = config.isCurFavorite
  state.isCyclingFavorites = config.isCyclingFavorites
  state.favorites = config.favorites
}

export const saveAppState = async () => {
  const success = await writeConfig(state)
  return success
}
