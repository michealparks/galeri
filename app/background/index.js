import {ipcRenderer as ipc} from 'electron'
import updateImage from './renderer'
import {clamp} from './util'
import storage from './util/storage'
import {UPDATE_RATE} from './util/default-values'

let lastUpdateTime = 0
let totalSuspendTime = 0
let startSuspendTime = 0
let updateId = -1
let isUpdating = false
let isSuspended = false
let isPaused = storage('is-paused') || false
let updateRate = storage('update-rate') || UPDATE_RATE

const startUpdateCycle = async () => {
  if (__dev__) console.log('startUpdateCycle()')

  isUpdating = true

  await updateImage()

  onUpdateCycleComplete()
}

const onUpdateCycleComplete = () => {
  if (__dev__) console.log('onUpdateCycleComplete()')

  isUpdating = false
  lastUpdateTime = Date.now()

  ipc.send('background:updated')

  if (shouldNotUpdate()) return

  totalSuspendTime = 0
  clearFutureUpdate()
  updateId = setTimeout(startUpdateCycle, remainingTime())
}

const clearFutureUpdate = () => {
  isUpdating = false
  clearTimeout(updateId)
  updateId = -1
}

const remainingTime = () => {
  const elapsedTime = Date.now() - lastUpdateTime
  const elapsedAwakeTime = elapsedTime - totalSuspendTime
  const timeLeft = updateRate - elapsedAwakeTime

  return clamp(timeLeft, 0, updateRate)
}

const shouldNotUpdate = () => {
  return isPaused || isSuspended || isUpdating
}

/**
 * Settings change events
 */
ipc.on('menubar:loaded', () => {
  ipc.send('background:is-paused', isPaused)
  ipc.send('background:update-rate', updateRate)
})

ipc.on('menubar:is-paused', (e, paused) => {
  isPaused = paused
  storage('is-paused', isPaused)
  clearFutureUpdate()

  if (!isPaused) {
    updateId = setTimeout(startUpdateCycle, remainingTime())
  }
})

ipc.on('menubar:update-rate', (e, rate) => {
  updateRate = rate
  storage('update-rate', updateRate)

  if (shouldNotUpdate()) return

  clearFutureUpdate()
  updateId = setTimeout(startUpdateCycle, remainingTime())
})

/**
 * Suspend events
 */
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

/**
 * Offline events
 */
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

/**
 * Init
 */
startUpdateCycle()
ipc.send('background:loaded')
