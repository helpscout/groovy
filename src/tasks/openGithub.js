const {openPage} = require('../utils')
const git = require('../git')

const logError = () =>
  console.log("You haven't pushed this project to Github yet!")

exports.openRemote = async () => {
  console.log('Opening Github Repo...')

  try {
    const githubUrl = await git.githubUrl()

    return openPage(githubUrl)
  } catch (err) {
    logError()
  }
}

exports.openIssues = async () => {
  console.log('Opening Github Issues...')

  try {
    const githubUrl = await git.githubUrl()
    const url = `${githubUrl}issues`

    openPage(url)
  } catch (err) {
    logError()
  }
}

exports.openPullRequests = async () => {
  console.log('Opening Github Pull Requests...')

  try {
    const githubUrl = await git.githubUrl()
    const url = `${githubUrl}pulls`

    openPage(url)
  } catch (err) {
    logError()
  }
}

exports.openCI = async () => {
  console.log('Opening Travis CI...')

  try {
    const repo = await git.remoteRepo()
    const url = `https://travis-ci.org/${repo}`

    openPage(url)
  } catch (err) {
    logError()
  }
}
