module.exports = open

function open (target) {
  let opener = ''

  if (process.env.SUDO_USER) {
    opener += `sudo -u ${process.env.SUDO_USER} `
  }

  if (__darwin__) opener += 'open'
  if (__linux__) opener += 'python -m webbrowser'
  if (__win32__) opener += 'start ""'

  return require('child_process')
    .exec(`${opener} "${target.replace(/"/g, '\\"')}"`)
}
