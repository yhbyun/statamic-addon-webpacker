// Nodejs
const console = require('console')

// Tools libraries
const chalk = require('chalk')

// WEBPACKER
// ––––––––––––––––––––––

/**
 * @name Webpacker
 * @description A Statamic plugin to help theme development with webpack
 *
 * @param {array} Entry files to process with webpack
 */
const webpacker = (entryFiles) => {
  // Make Settings global
  global.Settings = new (require('./Settings'))(entryFiles)

  // Function to log environement
  const environement = environmentName => {
    // Log environement to console
    console.log(`\n${chalk.green(Settings.appName.toUpperCase())} ${chalk.white(`=> ${environmentName} mode`)}\n`)
  }

  // Initiate Statamic Webpacker Plugin
  const init = () => {
    const hotFile = require('./helpers/hotFile')

    // If mode is development
    if (Settings.dev) {
      // Create hot file
      hotFile.create()

      // Log environement
      environement('development')

      // Run development script
      require('./webpack/script/dev')()
    }

    // If mode is production
    if (Settings.prod) {
      // If hot file exist remove it
      hotFile.delete()

      // Log environement
      environement('production')

      // Run production script
      require('./webpack/script/prod')()
    }
  }

  return init()
}

module.exports = webpacker
