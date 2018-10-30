/* global Settings */

// Webpack
const webpack = require('webpack')
const WebpackConfig = require(`../webpack.config`)
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const browserSyncServer = require('browser-sync').create()

// Tools libraries
const osNotifier = require('node-notifier')
const chalk = require('chalk')
const opn = require('opn')
const path = require('path')
const queryString = require('query-string')

// DEV SCRIPT
// ––––––––––––––––––––––

// Hot middleware
// ––––––––––––––––––––––

// config of [node_modules/webpack-hot-middleware/client.js] for hotMiddleware server
const hotMiddlewareClientConfig = {
  path: '/__webpack_hmr',
  reload: true,
  timeout: 4000,
  noinfo: !Settings.consoleDisplayWarning,
  quiet: !Settings.consoleDisplayError,
  overlay: Settings.overlayDisplayError,
  overlayWarnings: Settings.overlayDisplayWarning,
  overlayStyles: Settings.overlayStyles,
  ansiColors: Settings.overlayColors
}

const hotMiddlewareClientConfigQuery = queryString.stringify(hotMiddlewareClientConfig, {
  encode: false,
  sort: false
})
const hotMiddlewareClient = `webpack-hot-middleware/client?${hotMiddlewareClientConfigQuery}`

// webpack entry array
const webpackEntry = WebpackConfig.entry

// add hotMiddleware client to each entry
for (const name in webpackEntry) webpackEntry[name] = [hotMiddlewareClient, ...webpackEntry[name]]

// Browsersync server
// ––––––––––––––––––––––

// Console log message template
const logMessage = (eventName, fileName) => {
  console.log(`\n[${chalk.yellow(eventName)}] ${fileName}\n`)
}

// Browsersync notify message template
const notifyMessage = (eventName, fileName, delay = 2500) => {
  if (Settings.browserSyncNotify) {
    browserSyncServer.notify(`${eventName}: ${fileName}`, delay)
  }
}

// OS notify message template
const OSnotifyMessage = (icon, eventName, fileName) => {
  if (Settings.osNotify) {
    osNotifier.notify({
      title: Settings.appName,
      message: fileName ? `${eventName}: ${fileName}` : eventName,
      contentImage: path.resolve(Settings.nodeModulesAssetsPath, 'notification/logo.png'),
      icon: path.resolve(Settings.nodeModulesAssetsPath, `notification/${icon}.png`),
      sound: Settings.notifySound
    })
  }
}

// Define dev compiler
const devCompiler = webpack(WebpackConfig)

// BrowserSync server options
const browserSyncServerOptions = {
  // Main options
  browser: Settings.devBrowser,
  port: Settings.serverPort,
  proxy: Settings.proxy,
  https: Settings.https,
  notify: false,
  open: Settings.openWebsite ? 'local' : false,
  ui: {
    port: Settings.browserSyncPort
  },
  // Files refresh options
  watchEvents: ['add', 'change', 'unlink'],
  files: [
    {
      match: Settings.filesToRefresh,
      fn: (event, url) => {
        const fileName = path.basename(url)
        let eventName

        // BrowserSync event
        if (event === 'add') eventName = 'Add'
        if (event === 'change') eventName = 'Update'
        if (event === 'unlink') eventName = 'Remove'

        // Console notification message
        logMessage(eventName, fileName)

        // Web browser notification message
        notifyMessage(eventName, fileName)

        // OS notification message (COMPILE)
        OSnotifyMessage('compile', eventName, fileName)

        // Reload BrowserSync server
        browserSyncServer.reload()

        // OS notification message (RELOAD)
        OSnotifyMessage('success', 'Reloading Browsers')
      },
      options: {
        ignoreInitial: true
      }
    }
  ],
  // Dev middleware options
  middleware: [
    webpackDevMiddleware(devCompiler, {
      hot: true,
      logLevel: 'silent',
      lazy: false,
      publicPath: WebpackConfig.output.publicPath,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
      }
    }),
    webpackHotMiddleware(devCompiler, {
      log: false,
      path: '/__webpack_hmr',
      heartbeat: 2000
    })
  ],
  // Attach Browsersync to head not body
  snippetOptions: {
    rule: {
      match: /<\/head>/i,
      fn: (snippet, match) => snippet + match
    }
  }
}

// BrowserSync server callback
const browserSyncServerCallback = () => {
  // Open BrowserSync UI if enabled
  if (Settings.openBrowserSyncUI) opn(`http://localhost:${Settings.browserSyncPort}`, { app: Settings.devBrowser })
}

// Init BrowserSync server
module.exports = () => browserSyncServer.init(browserSyncServerOptions, browserSyncServerCallback)
