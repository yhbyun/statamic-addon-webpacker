// Tools libraries
const deepmerge = require('deepmerge')

// Plugins libraries
const TerserPlugin = require('terser-webpack-plugin')

// OPTIMIZATION CONFIG
// ––––––––––––––––––––––

module.exports = () => {
  let optimization = {
    // To keep filename consistent between different modes
    occurrenceOrder: true
  }

  // Code splitting webpack runtime code
  const runtimeChunk = {
    runtimeChunk: {
      name: 'manifest'
    }
  }

  // Code splitting node_modules vendors
  const vendorsChunk = {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 1
        }
      }
    }
  }

  // Code splitting entries common code
  const commonsChunk = {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
          priority: 0,
          reuseExistingChunk: true
        }
      }
    }
  }

  // Minify JS options
  const minimizer = {
    minimizer: [
      // JS minimizer
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          compress: {
            drop_console: true
          },
          output: {
            beautify: false,
            comments: false
          }
        }
      })
    ]
  }

  if (Settings.manifest) optimization = { ...optimization, ...runtimeChunk }
  if (Settings.vendors) optimization = deepmerge(optimization, vendorsChunk)
  if (Settings.commons) optimization = deepmerge(optimization, commonsChunk)
  if (Settings.prod) optimization = { ...optimization, ...minimizer }

  return optimization
}
