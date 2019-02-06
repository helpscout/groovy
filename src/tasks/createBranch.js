const execa = require('execa')

exports.createBranch = async name => {
  console.log('Creating git branch...')

  try {
    await execa('git', ['checkout', '-b', name])
    console.log(`${name} branch was created!`)
    console.log()
  } catch (err) {
    logError()
  }
}
