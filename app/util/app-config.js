import {readFile, writeFile, rename} from 'fs'
import path from 'path'
import {appPath} from './app-path'

const configPath = path.resolve(appPath, 'config.json')

const parse = (str) => { try { JSON.parse(str) } catch (e) {} }

export const readConfig = () => new Promise(resolve => {
  readFile(configPath, (err, raw) => {
    if (err) return resolve()

    return err ? resolve() : resolve(parse(raw.toString()))
  })
})

export const writeConfig = (config) => new Promise(resolve => {
  const tempConfigPath = (
    configPath + '-' +
    Math.random().toString().substr(2) +
    Date.now().toString() +
    path.extname(configPath)
  )

  writeFile(tempConfigPath, JSON.stringify(config, null, 2), (err) => {
    if (err) resolve(err)

    rename(tempConfigPath, configPath, () => resolve())
  })
})
