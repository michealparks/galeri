const {join} = require('path')

const darwin = (name) =>
  join(process.env['HOME'], 'Library', 'Application Support', name)

const linux = (name) => process.env['XDG_CONFIG_HOME']
  ? join(process.env['XDG_CONFIG_HOME'], name)
  : undefined // TODO this may break things

const win32 = (name) => process.env['LOCALAPPDATA']
  ? join(process.env['LOCALAPPDATA'], name)
  : join(process.env['USERPROFILE'], 'Local Settings', 'Application Data', name)

module.exports = (name) => __darwin__
  ? darwin(name)
  : __linux__
  ? linux(name)
  : win32(name)
