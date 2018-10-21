/* global Settings */

// Tools libraries
const chalk = require('chalk')
const path = require('path')
const fs = require('fs')

// WEBPACKER
// ––––––––––––––––––––––

const GetSettings = require('./getsettings')

/**
 * @name Webpacker
 * @description A Statamic plugin to help theme development with webpack
 *
 * @param {array} Entry files to process with webpack
 * @param {string} Path to Statamic site folder
 */
const webpacker = (entryFiles, sitePath) => {
  // Make Settings global
  global.Settings = new GetSettings(entryFiles, sitePath)

  // Make Webpacker path global
  global.WebpackerPath = path.resolve(__dirname)

  // Function to define and log environement
  const environement = environmentName => {
    // Define NODE_ENV
    process.env.NODE_ENV = environmentName

    // Log environement to console
    console.log(`\n${chalk.greenBright(Settings.appName.toUpperCase())} ${chalk.whiteBright.bold(`=>`)} ${chalk.yellow.bold(`${environmentName} mode`)}\n`)
  }

  // Initiate Statamic Webpacker Plugin
  const init = () => {
    const hot = path.resolve(Settings.themePath, 'hot')

    // If mode is development
    if (Settings.dev) {
      // Create hot file
      fs.open(hot, 'w', () => {
        // Define environement and log it
        environement('development')

        // Run development script
        require('./webpack/script/dev')()
      })
    }

    // If mode is production
    if (Settings.prod) {
      // If hot file exist remove it
      if (fs.existsSync(hot)) fs.unlinkSync(hot)

      // Define environement and log it
      environement('production')

      // Run production script
      require('./webpack/script/prod')()
    }
  }

  return init()
}

module.exports = webpacker
