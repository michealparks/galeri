import {join} from 'path'

const darwin = (name) => {
  return join(process.env['HOME'], 'Library', 'Application Support', name)
}

const linux = (name) => {
  if (process.env['XDG_CONFIG_HOME']) {
    return join(process.env['XDG_CONFIG_HOME'], name)
  }

  return join(process.env['HOME'], '.config', name)
}

const win32 = (name) => {
  if (process.env['LOCALAPPDATA']) {
    return join(process.env['LOCALAPPDATA'], name)
  }

  return join(process.env['USERPROFILE'], 'Local Settings', 'Application Data', name)
}

export const appConfigPath = (name) => {
  if (__darwin__) return darwin(name)
  if (__linux__) return linux(name)
  if (__win32__) return win32(name)
}

export default appConfigPath
