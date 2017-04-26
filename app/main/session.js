module.exports = function handleSession (url, session) {
  sessions.push(session)
}

let sessions = []

require('electron').ipcMain.on('artwork-updated', function () {
  sessions = sessions.filter(function (session) {
    return session !== null && session !== undefined
  })

  sessions.forEach(function (session) {
    session.clearStorageData({
      storages: [
        // 'localstorage',
        // 'appcache',
        'cookies',
        'filesystem',
        // 'indexdb',
        'shadercache',
        'websql',
        'serviceworkers'
      ],
      quotas: [
        'temporary',
        'persistent',
        'syncable'
      ]
    })

    session.clearCache(onClearCache)
  })
})

function onClearCache () {

}
