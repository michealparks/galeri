module.exports = packLinux

const {build, Platform} = require('electron-builder')

const config = {
  appId: 'io.galeri.app',
  copyright: 'Copyright © 2016 - 2017 Micheal Parks',
  productName: 'Galeri',
  files: [
    'package.json',
    'LICENSE',
    'main.js',
    'build/**/*',
    'assets'
  ],
  compression: 'store', // 'maximum', /* 'store', <-testing */
  linux: {
    target: [
      'snap',
      'deb'
    ],
    category: 'Education',
    synopsis: 'A perpetual artwork streaming app.',
    desktop: {
      Type: 'Application',
      Encoding: 'UTF-8',
      Name: 'Galeri',
      Version: '1.0',
      'X-GNOME-FullName': 'Galeri',
      Comment: 'A perpetual artwork streaming app.',
      // Icon: 'Galeri',
      Terminal: 'false',
      Path: '/opt/galeri',
      Exec: '/opt/galeri/Galeri %U',
      TryExec: '/opt/galeri/Galeri',
      StartupNotify: 'false',
      Categories: 'Productivity;Education'
    }
  },
  snap: {
    plugs: [
      'home',
      'x11',
      'unity7',
      'browser-support',
      'network',
      'gsettings',
      'opengl'
    ]
  }
}

function packLinux (next) {
  build({
    targets: Platform.LINUX.createTarget('deb'),
    config: config
  }).then(() => {
    return build({
      targets: Platform.LINUX.createTarget('snap'),
      config: config
    })
  }).catch(err => {
    next(err)
  })
}
