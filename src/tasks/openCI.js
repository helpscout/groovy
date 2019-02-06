const {openPage} = require('../utils')
const git = require('../git')

exports.openCI = async () => {
  console.log('Opening Travis CI...')

  try {
    const remoteOrigin = await git.getRemoteRepoName()
    const url = `https://travis-ci.org/${remoteOrigin}`

    openPage(url)
  } catch (err) {
    console.log(err)
  }
}
