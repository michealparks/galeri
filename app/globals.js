global.__version__ = JSON.stringify(require('../package.json').version)
global.__dev__ = process.env.NODE_ENV === 'development'
global.__darwin__ = process.platform === 'darwin'
global.__linux__ = process.platform === 'linux'
global.__win32__ = process.platform === 'win32'
