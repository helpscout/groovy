const fs = require('fs')
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

exports.getGitRepoFromRemoteOrigin = origin => {
  const matches = origin.match(
    /(git@github.com:|https:\/\/github.com\/)(.*)(.git)/
  )

  if (!matches.length) return ''

  return matches[2]
}

exports.getGithubUrlFromRemoteOrigin = origin => {
  const repo = getGitRepoFromRemoteOrigin(origin)

  return repo ? `https://github.com/${repo}/` : ''
}

exports.getNewPullRequestUrlFromRemoteOrigin = ({
  defaultBranch,
  currentBranch,
  origin,
}) => {
  const repoUrl = getGithubUrlFromRemoteOrigin(origin)
  if (!repoUrl) return ''

  return `${repoUrl}compare/${defaultBranch}...${currentBranch}`
}

exports.openPage = url => {
  console.log(url)
  return open(url)
}
