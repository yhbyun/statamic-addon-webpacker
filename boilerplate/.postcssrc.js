const mqpacker = require('css-mqpacker')
const sortCSSmq = require('sort-css-media-queries')
const postcssPresetEnv = require('postcss-preset-env')
const csso = require('postcss-csso');
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = ({ env }) => ({
  plugins: [
    mqpacker({
      sort: sortCSSmq
    }),
    env === 'production' ? purgecss({
      content: [
        './layouts/*.html',
        './templates/**/*.html',
        './partials/**/*.html'
      ],
      keyframes: true
    }) : false,
    env === 'production' ? csso({
      comments: false
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
