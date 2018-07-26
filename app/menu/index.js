import electron, {ipcRenderer as ipc} from 'electron'
import './on-link-click'
import './tabs'
import './prefs'
import './locale'

document.getElementById('quit').onclick = () => {
  electron.remote.app.quit()
}

document.getElementById('about').onclick = () => {
  ipc.send('open-about-window')
}

document.getElementById('favorited').onclick = () => {
  ipc.send('open-favorites-window')
}
