const ipc = require('electron').ipcRenderer
const updateImage = require('./renderer')
const {clamp} = require('./util')
const {get, set} = require('./util/storage')

let lastUpdateTime = 0
let totalSuspendTime = 0
let startSuspendTime = 0
let updateId = -1
let isUpdating = false
let isSuspended = false
let isPaused = get('is-paused') || false
let updateRate = get('update-rate') ||
  require('./util/default-values').updateRate

function startUpdateCycle () {
  isUpdating = true
  updateImage(onUpdateCycleComplete)
}

function onUpdateCycleComplete () {
  isUpdating = false
  lastUpdateTime = Date.now()

  ipc.send('background:updated')

  if (shouldNotUpdate()) return

  totalSuspendTime = 0
  clearFutureUpdate()
  updateId = setTimeout(startUpdateCycle, remainingTime())
}

function clearFutureUpdate () {
  isUpdating = false
  clearTimeout(updateId)
  updateId = -1
}

function remainingTime () {
  const elapsedTime = Date.now() - lastUpdateTime
  const elapsedAwakeTime = elapsedTime - totalSuspendTime
  const timeLeft = updateRate - elapsedAwakeTime

  console.log('time left', timeLeft)

  // Just for good measure
  return clamp(timeLeft, 0, updateRate)
}

function shouldNotUpdate () {
  return isPaused || isSuspended || isUpdating
}

ipc.on('menubar:get-settings', () => {
  ipc.send('background:is-paused', isPaused)
  ipc.send('background:update-rate', updateRate)
})

ipc.on('menubar:is-paused', (e, paused) => {
  isPaused = paused
  set('is-paused', isPaused)
  clearFutureUpdate()

  if (!isPaused) {
    updateId = setTimeout(startUpdateCycle, remainingTime())
  }
})

ipc.on('menubar:update-rate', (e, rate) => {
  updateRate = rate
  set('update-rate', updateRate)

  if (shouldNotUpdate()) return

  clearFutureUpdate()
  updateId = setTimeout(startUpdateCycle, remainingTime())
})

ipc.on('main:suspend', () => {
  isSuspended = true
  startSuspendTime = Date.now()
  clearFutureUpdate()
})

ipc.on('main:resume', () => {
  isSuspended = false
  totalSuspendTime += (Date.now() - startSuspendTime)

  if (shouldNotUpdate()) return

  updateId = setTimeout(startUpdateCycle, remainingTime())
})

window.addEventListener('online', () => {
  if (!navigator.onLine) return

  if (shouldNotUpdate()) return

  if (__dev__) console.warn('main:online')

  clearFutureUpdate()

  updateId = setTimeout(startUpdateCycle, remainingTime())
})

window.addEventListener('offline', () => {
  if (navigator.onLine) return

  if (__dev__) console.warn('main:offline')

  clearFutureUpdate()
})

startUpdateCycle()

ipc.send('background:loaded')
