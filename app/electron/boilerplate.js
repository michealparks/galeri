import {resolve} from 'path'

global.eval = () => {
  console.error('eval is disabled for this app.')
}
