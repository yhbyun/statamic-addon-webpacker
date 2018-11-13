// Nodejs
const process = require('process')
const console = require('console')

// Webpack
const webpack = require('webpack')
const WebpackConfig = require(`../webpack.config`)

// Tools libraries
const opn = require('opn')
const chalk = require('chalk')

// PROD SCRIPT
// ––––––––––––––––––––––

// Define prod compiler
const prodCompiler = webpack(WebpackConfig, (error, stats) => {
  // Method to kill Webpacker process
  const killWebpaker = process.exit

  // Handle errors
  if (error) {
    console.error(`\n${chalk.red(error.stack || error)}\n`)
    if (error.details) {
      console.error(error.details);
    }
    return;
  }

  // If build error hapen
  if (stats.hasErrors()) {
    // Output an error message in the console
    console.error(`\n${chalk.red('FRAAAAAAKKK, BUILD FAILED!!!')} ${chalk.white('Read more above')} ${chalk.red('↑ ↑ ↑')}`)
    console.log(`\nTry a little harder... your Statamic theme ${chalk.bold(Settings.themeName.toUpperCase())} is almost ready for production!!!`)

    // Kill Webpacker process
    killWebpaker()
  }

  // Output build info in the console
  process.stdout.write(
    `${stats.toString({
      builtAt: false,
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
      entrypoints: false,
      version: false,
      hash: false,
      timings: false,
      excludeAssets: [/\.map$/]
    })}\n\n`
  )

  // Output a success message in the console
  console.log(`\n${chalk.green('YEEEHAAAAAA, BUILD COMPLETED!!!')} ${chalk.white('Read more above')} ${chalk.green('↑ ↑ ↑')}`)
  console.log(`\nThis is awesome... your Statamic theme ${chalk.bold(Settings.themeName.toUpperCase())} is ready for production!!!`)

  // Open website on local server if enabled
  if (Settings.openWebsite) opn(Settings.proxy, { app: Settings.devBrowser })

  // Kill Webpacker process if BundleAnalyzer is not enabled
  if (!Settings.openBundleAnalyzer) killWebpaker()
})

// Init Webpack build process
module.exports = () => prodCompiler
