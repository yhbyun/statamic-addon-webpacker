// OUTPUT CONFIG
// ––––––––––––––––––––––

module.exports = () => {
  const output = {
    path: Settings.outputPath,
    filename: Settings.dev ? 'js/[name].js' : 'js/[name].[chunkhash].js',
    publicPath: Settings.dev ? '/' : Settings.publicPath
  }

  return output
}
