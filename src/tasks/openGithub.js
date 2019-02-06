const {openPage} = require('../utils')
const git = require('../git')

const logError = () =>
  console.log("You haven't pushed this project to Github yet!")

exports.openRemote = async () => {
  console.log('Opening Github Repo...')

  try {
    const githubUrl = await git.getGithubUrl()

    openPage(githubUrl)
  } catch (err) {
    logError()
  }
}

exports.openIssues = async () => {
  console.log('Opening Github Issues...')

  try {
    const githubUrl = await git.getGithubUrl()
    const url = `${githubUrl}issues`

    openPage(url)
  } catch (err) {
    logError()
  }
}

exports.openPullRequests = async () => {
  console.log('Opening Github Pull Requests...')

  try {
    const githubUrl = await git.getGithubUrl()
    const url = `${githubUrl}pulls`

    openPage(url)
  } catch (err) {
    logError()
  }
}

exports.openCI = async () => {
  console.log('Opening Travis CI...')

  try {
    const remoteOrigin = await git.getRemoteRepoName()
    const url = `https://travis-ci.org/${remoteOrigin}`

    openPage(url)
  } catch (err) {
    logError()
  }
}
