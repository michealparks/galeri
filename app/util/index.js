import {format} from 'url'
import {resolve} from 'path'

export const getUrl = (name) => format({
  protocol: 'file',
  slashes: true,
  pathname: resolve(__dirname, __dev__ ? 'app' : 'build', name + '.html')
})
