// Nodejs
const process = require('process')

// API HELPER
// ––––––––––––––––––––––

module.exports = {
  killProcess: () => {
    // Method to kill Webpacker process
    const exit = process.exit
    exit()
  }
}
