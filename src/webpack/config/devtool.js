// DEVTOOL CONFIG
// ––––––––––––––––––––––

module.exports = () => {
  const devtool = Settings.dev ? Settings.devSourceMaps : Settings.prodSourceMaps

  return devtool
}
