// Nodejs
const fs = require('fs')
const path = require('path')

// HOTFILE HELPER
// ––––––––––––––––––––––

const hot = path.resolve(Settings.themePath, 'hot')

module.exports = {
  create: () => {
    // Create hot file
    fs.writeFile(hot, 'w', function(err) {
      if (err) throw err
    })
  },
  delete: () => {
    // If hot file exist remove it
    if (fs.existsSync(hot)) fs.unlinkSync(hot)
  }
}
