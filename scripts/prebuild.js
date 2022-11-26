import fs from 'node:fs'
import config from '../src-tauri/tauri.conf.json' assert { type: 'json' }
import pkgJson from '../package.json' assert { type: 'json' }
import changelog from '../changelog.json' assert { type: 'json' }

const { version } = config.package

fs.writeFileSync('package.json', JSON.stringify({
  ...pkgJson,
  version,
}, null, 2))

fs.writeFileSync('release.json', JSON.stringify({
  version,
  notes: changelog.pop().notes,
  pub_date: new Date().toISOString(),
  platforms: {
    'darwin-x86_64': {
      signature: '',
      url: `https://github.com/lemarier/tauri-test/releases/download/${version}/app.app.tar.gz`
    },
    'darwin-aarch64': {
      signature: '',
      url: `https://github.com/lemarier/tauri-test/releases/download/${version}/silicon/app.app.tar.gz`
    },
    'linux-x86_64': {
      signature: '',
      url: `https://github.com/lemarier/tauri-test/releases/download/${version}/app.AppImage.tar.gz`
    },
    'windows-x86_64': {
      signature: '',
      url: `https://github.com/lemarier/tauri-test/releases/download/${version}/app.x64.msi.zip`
    }
  }
}, null, 2))