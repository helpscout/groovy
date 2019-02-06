const fs = require('fs')
const path = require('path')
const pkgUp = require('pkg-up')
const open = require('opn')

exports.getHomeDir = () =>
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE

/**
 * Reads the contents of a file.
 * @param {string} filepath  The filepath to read.
 * @returns {string} The contents of the file.
 */
exports.readFile = filepath => {
  return fs.readFileSync(filepath, 'utf8')
}

exports.openPage = url => {
  console.log(url)
  return open(url, {wait: false})
}

exports.getProjectPath = async () => {
  const pkg = await pkgUp()
  return path.dirname(pkg)
}
