module.exports = applicationConfigPath

const path = require('path')

function darwin (name) {
  return path.join(process.env['HOME'], 'Library', 'Application Support', name)
}

function linux (name) {
  if (process.env['XDG_CONFIG_HOME']) {
    return path.join(process.env['XDG_CONFIG_HOME'], name)
  }

  return path.join(process.env['HOME'], '.config', name)
}

function win32 (name) {
  if (process.env['LOCALAPPDATA']) {
    return path.join(process.env['LOCALAPPDATA'], name)
  }

  return path.join(process.env['USERPROFILE'], 'Local Settings', 'Application Data', name)
}

function applicationConfigPath (name) {
  if (__darwin__) return darwin(name)
  if (__linux__) return linux(name)
  if (__win32__) return win32(name)
}
