'use strict'
/* global fetch, URL */

const handleErrors = response => {
  if (!response.ok) {
    return Promise.reject(response.statusText)
  }
  return response
}

const loadImage = src => fetch(src)
  .then(handleErrors)
  .then(response => response.blob())
  .then(blob => URL.createObjectURL(blob))

module.exports = loadImage
