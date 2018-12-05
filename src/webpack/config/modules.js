// Modules libraries
const MiniCssExtractLoader = require('mini-css-extract-plugin').loader
const Fiber = require('fibers');

// MODULES CONFIG
// ––––––––––––––––––––––

module.exports = () => {
  const modules = {
    rules: [
      // JAVASCRIPT linter (using ESLINT)
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              emitWarning: true
            }
          }
        ]
      },

      // JAVASCRIPT loader (using BABEL)
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      // STYLE loader (using SASS and POSTCSS)
      {
        test: /\.(scss|sass|css)$/,
        use: [
          {
            loader: Settings.prod ? MiniCssExtractLoader : 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 3
            }
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              implementation: require('sass'),
              fiber: Fiber
            }
          }
        ]
      },
      // IMAGE loader
      {
        test: /\.(webp|png|jpg|jpeg|gif|svg|ico)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: Settings.dev ? 'images/[name].[ext]' : 'images/[name].[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              enabled: Settings.prod,
              bypassOnDebug: true
            }
          }
        ]
      },
      // FONT loader
      {
        test: /\.(woff|woff2|eot|ttf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: Settings.dev ? 'fonts/[name].[ext]' : 'fonts/[name].[hash].[ext]'
            }
          }
        ]
      }
    ]
  }

  return modules
}
