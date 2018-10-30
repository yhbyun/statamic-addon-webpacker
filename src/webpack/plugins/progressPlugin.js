// Progress plugin

const webpack = require('webpack')
const ora = require('ora')
const chalk = require('chalk')

function spinnerPlugin () {
  let running = false
  let lastStage = ''
  const spinner = ora({ color: 'green', text: chalk.green('start building...') }).info()

  // reset variables
  const _reset = () => {
    running = false
    lastStage = ''
  }

  // output stage message
  const logStage = stage => {
    if (!stage || (lastStage && lastStage !== stage)) {
      spinner.succeed(chalk.grey(lastStage))
    }
    if (stage && stage !== lastStage) {
      spinner.start(stage)
    }
  }

  return new webpack.ProgressPlugin((percentage, stage) => {
    if (!running) {
      running = true
    }
    if (percentage < 1) {
      logStage(stage)
      // save stage
      lastStage = stage
    } else {
      // output the last stage
      logStage()
      _reset()
    }
  })
}

module.exports = spinnerPlugin
