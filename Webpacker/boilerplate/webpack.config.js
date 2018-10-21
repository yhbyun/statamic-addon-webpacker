// Webpacker
const webpacker = require('statamic-addon-webpacker')

// Tools libraries
const path = require('path')

// The path to Statamic USER folder
const userPath = path.resolve(__dirname, '../../')

// Your entry files (put them all in user/active_theme/src)
const entryFiles = ['scss/entry/app.scss', 'js/entry/app.js']

// Init Webpacker
webpacker(entryFiles, userPath)
