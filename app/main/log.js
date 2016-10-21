const { BrowserWindow } = require('electron')

function sendToBackground (msg, arg) {
  return BrowserWindow.getAllWindows()[0].webContents.send(msg, arg)
}

function noop () {}

function send (type, ...args) {
  return sendToBackground('log', { type, args })
}

const prod = process.env.NODE_ENV === 'production'
const log = prod ? noop : send.bind(null, 'log')
const warn = prod ? noop : send.bind(null, 'warn')
const error = prod ? noop : send.bind(null, 'error')

module.exports = { log, warn, error }
