const mqpacker = require('css-mqpacker')
const sortCSSmq = require('sort-css-media-queries')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = ({ env }) => ({
  plugins: [
    mqpacker({
      sort: sortCSSmq
    }),
    env === 'production' ? cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true
          }
        }
      ]
    }) : false,
    env === 'production' ? purgecss({
      content: [
        './layouts/*.html',
        './templates/**/*.html',
        './partials/**/*.html'
      ],
      keyframes: true
    }) : false,
    postcssPresetEnv({
      features: {
        customProperties: {
          warnings: false
        }
      }
    })
  ]
})
