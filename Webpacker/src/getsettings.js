// Tools libraries
const zipObject = require('lodash/zipObject')
const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const cli = require('yargs').argv

// HELPERS
// ––––––––––––––––––––––

const parseYaml = yamlPath => yaml.load(fs.readFileSync(yamlPath, 'utf8'))

const uriEncode = object => encodeURIComponent(JSON.stringify(object))

const prependPath = (destination, pathsArray) => {
  const newPaths = []

  for (let i = 0; i < pathsArray.length; i++) {
    const oldPath = pathsArray[i]
    const newPath = path.resolve(destination, oldPath)

    newPaths[i] = newPath
  }

  return newPaths
}

// SETTINGS
// ––––––––––––––––––––––

class Settings {
  // Settings constructor
  constructor(entryFiles, sitePath) {
    // Webpacker addon settings
    const addonSettings = parseYaml(path.resolve(`${sitePath}/settings/addons/webpacker.yaml`))

    // Theme settings
    const themeSettings = parseYaml(path.resolve(`${sitePath}/settings/theming.yaml`))

    // Localhost certificates
    const sslCerts = {
      key: path.resolve(sitePath, 'addons/Webpacker/certs/localhost.key'),
      cert: path.resolve(sitePath, 'addons/Webpacker/certs/localhost.crt')
    }

    // Active theme
    const activeTheme = themeSettings.theme
    const _themePath = path.resolve(sitePath, `themes/${activeTheme}`)

    // Theme Meta
    const themeMeta = parseYaml(path.resolve(`${_themePath}/meta.yaml`))
    const _themeName = themeMeta.name
    const _themeVersion = themeMeta.version
    const _themeDescription = themeMeta.description

    // Path
    const outputFolder = addonSettings.output_folder ? `${addonSettings.output_folder}/` : ''
    const _outputPath = path.resolve(_themePath, outputFolder)
    const _publicPath = `/site/themes/${activeTheme}/${outputFolder}`

    // Assets entry
    const _entry = (() => {
      const sourcePath = path.resolve(_themePath, 'src')
      const entriesName = []
      const entriesPath = []
      const entries = prependPath(sourcePath, entryFiles)

      for (let i = 0; i < entries.length; i++) {
        const entryPath = entries[i]
        const entryExtension = path.extname(entryPath)

        entriesName[i] = path.basename(entryPath, entryExtension)
        entriesPath[i] = [entryPath]
      }

      return zipObject(entriesName, entriesPath)
    })()

    // Mode
    const webpackerMode = cli.mode
    const _dev = webpackerMode === 'development'
    const _prod = webpackerMode === 'production'

    // Development server
    const _proxy = addonSettings.proxy
    const _https = addonSettings.https ? (addonSettings.ssl_certs ? sslCerts : true) : false
    const _consoleDisplayError = addonSettings.console_display.includes('error')
    const _consoleDisplayWarning = addonSettings.console_display.includes('warning')
    const _overlayDisplayError = addonSettings.overlay_display.includes('error')
    const _overlayDisplayWarning = addonSettings.overlay_display.includes('warning')

    // Overlay colors
    const _overlayColors = uriEncode({
      reset: ['transparent', 'transparent'],
      black: '181818',
      red: 'E36049',
      green: 'B3CB74',
      yellow: 'FFD080',
      blue: '7CAFC2',
      magenta: '7FACCA',
      cyan: 'C3C2EF',
      lightgrey: 'EBE7E3',
      darkgrey: '6D7891'
    })

    // Overlay themes
    const themes = {
      light: {
        color: 'rgba(29, 29, 38, 0.9)',
        background: '#CCCCCC'
      },
      dark: {
        color: '#CCCCCC',
        background: 'rgba(29, 29, 38, 0.9)'
      }
    }

    // Overlay styles
    const _overlayStyles = uriEncode({
      color: themes[addonSettings.overlay_theme].color,
      background: themes[addonSettings.overlay_theme].background,
      lineHeight: '20px',
      whiteSpace: 'pre',
      fontFamily: 'Menlo, Consolas, monospace',
      fontSize: '13px',
      position: 'fixed',
      zIndex: 9999999,
      padding: '15px',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      overflow: 'auto',
      dir: 'ltr',
      textAlign: 'left'
    })

    // Web browser
    const _devBrowser = addonSettings.dev_browser === 'os_default' ? null : addonSettings.dev_browser
    const _openWebsite = addonSettings.open_website

    // Tools
    const _openBrowserSyncUI = addonSettings.open_browsersyncui
    const _openBundleAnalyzer = addonSettings.open_bundleanalyzer

    // Notifications
    const _osNotify = addonSettings.os_notify
    const _osNotifySound = addonSettings.os_notify_sound ? 'Submarine' : false
    const _browserSyncNotify = addonSettings.browsersync_notify

    // Code splitting
    const _manifest = addonSettings.manifest
    const _vendors = addonSettings.vendors
    const _commons = addonSettings.commons

    // Devtools
    const _devSourceMaps = addonSettings.dev_sourcemaps
    const _prodSourceMaps = addonSettings.prod_sourcemaps

    // Browsersync file to refresh
    const _filesToRefresh = prependPath(sitePath, [
      'content/collections/**/*.md',
      'content/pages/**/*.md',
      `themes/${activeTheme}/layouts/**/*.html`,
      `themes/${activeTheme}/partials/**/*.html`,
      `themes/${activeTheme}/templates/**/*.html`
    ])

    // Return Settings array
    return {
      appName: 'webpacker',
      themeName: _themeName,
      themeVersion: _themeVersion,
      themeDescription: _themeDescription,
      entry: _entry,
      mode: webpackerMode,
      dev: _dev,
      prod: _prod,
      proxy: _proxy,
      serverPort: 3001,
      browserSyncPort: 3002,
      bundleAnalyzerPort: 3003,
      https: _https,
      themePath: _themePath,
      outputPath: _outputPath,
      publicPath: _publicPath,
      devBrowser: _devBrowser,
      openWebsite: _openWebsite,
      consoleDisplayError: _consoleDisplayError,
      consoleDisplayWarning: _consoleDisplayWarning,
      overlayDisplayError: _overlayDisplayError,
      overlayDisplayWarning: _overlayDisplayWarning,
      overlayColors: _overlayColors,
      overlayStyles: _overlayStyles,
      osNotify: _osNotify,
      osNotifySound: _osNotifySound,
      browserSyncNotify: _browserSyncNotify,
      openBrowserSyncUI: _openBrowserSyncUI,
      openBundleAnalyzer: _openBundleAnalyzer,
      manifest: _manifest,
      vendors: _vendors,
      commons: _commons,
      devSourceMaps: _devSourceMaps,
      prodSourceMaps: _prodSourceMaps,
      filesToRefresh: _filesToRefresh
    }
  }
}

// Export Settings
module.exports = Settings
