// Webpacker
const webpacker = require('statamic-addon-webpacker')

// Tools libraries
const path = require('path')

// The path to Statamic USER folder
const userPath = path.resolve(__dirname, '../../')

// Your entry files
const entryFiles = ['scss/entry/app.scss', 'js/entry/app.js']

// Init Webpacker
webpacker(entryFiles, userPath)
