module.exports = open

function open (target) {
  let opener = ''

  if (process.env.SUDO_USER) {
    opener += `sudo -u ${process.env.SUDO_USER} `
  }

  switch (process.platform) {
    case 'darwin':
      opener += 'open'
      break
    case 'win32':
      opener += 'start ""'
      break
    default:
      opener += 'python -m webbrowser'
      break
  }

  return require('child_process')
    .exec(`${opener} "${target.replace(/"/g, '\\"')}"`)
}
