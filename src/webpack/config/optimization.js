// Plugins libraries
const TerserPlugin = require('terser-webpack-plugin')

// OPTIMIZATION CONFIG
// ––––––––––––––––––––––

module.exports = () => {
  // JS minimizer configuration
  const minimizerConfig = [
    new TerserPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      terserOptions: {
        compress: {
          drop_debugger: true,
          drop_console: true,
          dead_code: true
        },
        output: {
          beautify: false,
          comments: false
        }
      }
    })
  ]

  // Code splitting webpack runtime code
  const runtimeChunkConfig = {
    name: 'runtime'
  }

  // Code splitting node_modules vendor
  const vendorChunkConfig = {
    test: /node_modules\/(.*)\.js/,
    name: 'vendor',
    chunks: 'all',
    priority: 1
  }

  // Code splitting entries common code
  const commonChunkConfig = {
    test: /\.js$/,
    name: 'common',
    chunks: 'initial',
    minChunks: 2,
    priority: 0,
    reuseExistingChunk: true
  }

  const optimization = {
    noEmitOnErrors: true,
    minimizer: minimizerConfig,
    runtimeChunk: Settings.runtime ? runtimeChunkConfig : false,
    splitChunks: {
      cacheGroups: {
        default: false,
        vendors: Settings.vendors ? vendorChunkConfig : false,
        commons: Settings.commons ? commonChunkConfig : false
      }
    }
  }

  return optimization
}
