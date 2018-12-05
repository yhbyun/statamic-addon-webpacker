// OUTPUT CONFIG
// ––––––––––––––––––––––

module.exports = () => {
  const output = {
    path: Settings.outputPath,
    publicPath: Settings.dev ? '/' : Settings.publicPath,
    filename: Settings.dev ? 'js/[name].js' : 'js/[name].[chunkhash].js',
    chunkFilename: Settings.dev ? 'js/[name].js' : 'js/[name].[chunkhash].js',
  }

  return output
}
