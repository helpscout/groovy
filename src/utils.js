const fs = require('fs')
const path = require('path')

const getHomeDir = () =>
  process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE

/**
 * Reads the contents of a file.
 * @param {string} filepath  The filepath to read.
 * @returns {string} The contents of the file.
 */
function readFile(filepath) {
  return fs.readFileSync(filepath, 'utf8')
}

/**
 * Checks to see if the directory exists.
 * @param {string} directory The path of the directory to check.
 * @returns {boolean} The result.
 */
function dirExists(directory) {
  return (
    fs.existsSync(directory) &&
    fs.statSync(path.resolve(directory)).isDirectory()
  )
}

function getGitRepoFromRemoteOrigin(origin) {
  const matches = origin.match(
    /(git@github.com:|https:\/\/github.com\/)(.*)(.git)/
  )

  if (!matches.length) return ''

  return matches[2]
}

function getGithubUrlFromRemoteOrigin(origin) {
  const repo = getGitRepoFromRemoteOrigin(origin)

  return repo ? `https://github.com/${repo}/` : ''
}

function getNewPullRequestUrlFromRemoteOrigin({
  defaultBranch,
  currentBranch,
  origin,
}) {
  const repoUrl = getGithubUrlFromRemoteOrigin(origin)
  if (!repoUrl) return ''

  return `${repoUrl}compare/${defaultBranch}...${currentBranch}`
}

module.exports = {
  readFile,
  dirExists,
  getGitRepoFromRemoteOrigin,
  getGithubUrlFromRemoteOrigin,
  getNewPullRequestUrlFromRemoteOrigin,
  getHomeDir,
}
