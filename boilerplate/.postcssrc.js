const mqpacker = require('css-mqpacker')
const sortCSSmq = require('sort-css-media-queries')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')

module.exports = {
  plugins: [
    mqpacker({
      sort: sortCSSmq
    }),
    cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true
          }
        }
      ]
    }),
    postcssPresetEnv({
      features: {
        customProperties: {
          warnings: false
        }
      }
    })
  ]
}
