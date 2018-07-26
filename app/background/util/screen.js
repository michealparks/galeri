import {clamp} from './index'

export const screenWidth = () => {
  return clamp(window.innerWidth * window.devicePixelRatio, 0, 2200) - 400
}

export const screenHeight = () => {
  return clamp(window.innerHeight * window.devicePixelRatio, 0, 2200) - 400
}
