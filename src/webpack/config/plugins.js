// Nodejs
const path = require('path')

// Webpack
const webpack = require('webpack')

// Plugins libraries
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const StyleLintPlugin = require('stylelint-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const WebpackNotifierPlugin = require('webpack-build-notifier')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CleanWebpackPlugin = require('clean-webpack-plugin')
const WebpackAssetsManifest = require('webpack-assets-manifest')
const ProgressPlugin = require('../plugins/progressPlugin')

// PLUGINS CONFIG
// ––––––––––––––––––––––

module.exports = () => {
  let plugins = []

  // Development plugins
  // ––––––––––––––––––––––

  if (Settings.dev) {
    plugins.push(
      // enable HMR globally
      new webpack.HotModuleReplacementPlugin()
    )
  }

  // Production plugins
  // ––––––––––––––––––––––

  if (Settings.prod) {
    plugins.push(
      // Will cause hashes to be based on the relative path of the module, generating a four character string as the module id
      new webpack.HashedModuleIdsPlugin(),

      // Plugin to extract S|A|CSS code from JS
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash].css'
      }),

      // Cleanup dist folder before saving new build
      new CleanWebpackPlugin(['js', 'css', 'images', 'fonts'], {
        root: Settings.outputPath,
        beforeEmit: true,
        verbose: false
      }),

      // Ganerate webpacker.json file that contain path reference to all builded assets
      new WebpackAssetsManifest({
        output: 'webpacker.json',
        publicPath: true,
        transform(assets) {
          // Theme infos
          const buildInfos = {
            BUILD_INFORMATIONS: {
              date: new Date(Date.now()).toLocaleString(),
              theme: `${Settings.themeName} - v${Settings.themeVersion}`,
              description: Settings.themeDescription
            }
          }

          return Object.assign(buildInfos, assets)
        },
        customize(entry) {
          // Prevent adding sourcemap to the manifest
          if (entry.key.toLowerCase().endsWith('.map')) {
            return false
          }
        }
      })
    )
  }

  // Common Plugins
  // ––––––––––––––––––––––

  // Display webpack progress in the console
  plugins.push(new ProgressPlugin())

  // Better error feedback in the console
  plugins.push(new FriendlyErrorsWebpackPlugin())

  // Provide Styletint support
  plugins.push(
    new StyleLintPlugin({
      fix: true
    })
  )

  // Provide access to environment from assets
  plugins.push(
    new webpack.DefinePlugin({
      STATAMIC_DEV: Settings.dev,
      STATAMIC_PROD: Settings.prod
    })
  )

  // Provide OS Notification
  if (Settings.osNotify) {
    plugins.push(
      new WebpackNotifierPlugin({
        title: Settings.appName,
        sound: Settings.osNotifySound,
        suppressCompileStart: false,
        logo: path.resolve(Settings.nodeModulesAssetsPath, 'notification/logo.png'),
        successIcon: path.resolve(Settings.nodeModulesAssetsPath, 'notification/success.png'),
        warningIcon: path.resolve(Settings.nodeModulesAssetsPath, 'notification/warning.png'),
        failureIcon: path.resolve(Settings.nodeModulesAssetsPath, 'notification/failure.png'),
        compileIcon: path.resolve(Settings.nodeModulesAssetsPath, 'notification/compile.png')
      })
    )
  }

  // Create a server with Bundle Analyzer
  if (Settings.openBundleAnalyzer) {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerHost: 'localhost',
        analyzerPort: Settings.bundleAnalyzerPort,
        logLevel: 'silent'
      })
    )
  }

  return plugins
}
