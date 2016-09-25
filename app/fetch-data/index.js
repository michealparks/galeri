const { ipcRenderer } = require('electron')
const { getImages } = require('./wikipedia')
const getProps = require('./get-props')

let setImageTimeoutId
const setImageInterval = 10000 // 1000 * 60 * 60

const setImage = (images, updateFn) => {
  // set timeout to randomly select image again
  setImageTimeoutId = setTimeout(() => {
    setImage(images, updateFn)
  }, setImageInterval)

  return getProps(images).then(props => {
    updateFn(props)
    ipcRenderer.send('next-image-done', props)
  })
}

const init = updateFn => {
  // TODO check if image array is older than 48 hours
    // TODO if older then fetch new image data and store in db

  // TODO set timeout to update image array

  // randomly select an image
  getImages().then(images => {
    // listen for requests for next image
    ipcRenderer.on('next-image-request', () => {
      clearTimeout(setImageTimeoutId)
      setImage(images, updateFn)
    })

    // cancel any data fetching if the computer is suspended
    ipcRenderer.on('suspend', () => {
      clearTimeout(setImageTimeoutId)
    })

    // resume image fetching when awakened
    ipcRenderer.on('resume', () => {
      setImage(images, updateFn)
    })

    const onOnlineStatusChange = () => {
      if (navigator.onLine) {
        setImage(images, updateFn)
      } else {
        clearTimeout(setImageTimeoutId)
      }
    }

    window.addEventListener('online', onOnlineStatusChange)
    window.addEventListener('offline', onOnlineStatusChange)

    // set initial image
    onOnlineStatusChange()
  })
}

module.exports = init
