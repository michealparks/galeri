const {exec} = require('child_process')

module.exports = (url) => {
  let opener = ''

  if (process.env.SUDO_USER) {
    opener += `sudo -u ${process.env.SUDO_USER} `
  }

  if (__darwin__) opener += 'open'
  if (__linux__) opener += 'python -m webbrowser'
  if (__win32__) opener += 'start ""'

  return exec(`${opener} "${url.replace(/"/g, '\\"')}"`)
}
