const execa = require('execa')

exports.createBranch = async name => {
  console.log('Creating git branch...')

  try {
    execa('git', 'checkout', '-b', name)
  } catch (err) {
    logError()
  }
}
