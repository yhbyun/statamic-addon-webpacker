// Nodejs
const process = require('process')

// Webpack
const webpack = require('webpack')
const WebpackConfig = require(`../webpack.config`)

// Tools libraries
const opn = require('opn')

// PROD SCRIPT
// ––––––––––––––––––––––

// Define prod compiler
const prodCompiler = webpack(WebpackConfig)

// Build Callback
const buildCallback = (error, stats) => {
  // Handle errors
  if (error) throw error

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
    })}\n`
  )

  // Open website on local server if enabled
  if (Settings.openWebsite) opn(Settings.proxy, { app: Settings.devBrowser })

  // Method to stop Webpacker process
  const killWebpaker = process.exit;

  // Kill node process if BundleAnalyzer is not enabled
  if (!Settings.openBundleAnalyzer) killWebpaker()
}

// Init Webpack build process
module.exports = () => prodCompiler.run(buildCallback)
