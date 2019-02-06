const path = require('path')
const execa = require('execa')
const parseRepo = require('parse-repo')
const {getProjectPath} = require('./utils')

exports.currentBranch = () =>
  execa.stdout('git', ['symbolic-ref', '--short', 'HEAD'])

exports.isWorkingTreeClean = async () => {
  try {
    const {stdout: status} = await execa('git', ['status', '--porcelain'])
    if (status !== '') {
      return false
    }

    return true
  } catch (_) {
    return false
  }
}

exports.verifyWorkingTreeIsClean = async () => {
  if (!(await exports.isWorkingTreeClean())) {
    throw new Error('Unclean working tree. Commit or stash changes first.')
  }
}

exports.isRemoteHistoryClean = async () => {
  let history
  try {
    // Gracefully handle no remote set up.
    history = await execa.stdout('git', [
      'rev-list',
      '--count',
      '--left-only',
      '@{u}...HEAD',
    ])
  } catch (_) {}

  if (history && history !== '0') {
    return false
  }

  return true
}

exports.verifyRemoteHistoryIsClean = async () => {
  if (!(await exports.isRemoteHistoryClean())) {
    throw new Error('Remote history differs. Please pull changes.')
  }
}

exports.verifyRemoteIsValid = async () => {
  try {
    await execa('git', ['ls-remote', 'origin', 'HEAD'])
  } catch (error) {
    throw new Error(error.stderr.replace('fatal:', 'Git fatal error:'))
  }
}

exports.fetch = () => execa('git', ['fetch'])

exports.newBranch = async name => execa('git', ['checkout', '-b', name])

exports.push = () => execa('git', ['push', '--follow-tags'])

exports.pushCurrentBranch = async branch => {
  try {
    const currentBranch = branch || (await exports.currentBranch())
    return execa('git', ['push', '-u', 'origin', currentBranch])
  } catch (error) {
    throw error
  }
}

exports.remoteOrigin = async () => {
  try {
    return await execa.stdout('git', ['remote', 'get-url', 'origin'])
  } catch (error) {
    throw error
  }
}

exports.localRepo = async () => {
  try {
    const branch = await exports.currentBranch()
    const projectPath = await getProjectPath()

    return path.resolve(projectPath, branch)
  } catch (error) {
    throw error
  }
}

exports.remoteRepo = async () => {
  try {
    const repo = parseRepo(await exports.remoteOrigin())
    return repo.repository
  } catch (error) {
    throw error
  }
}

exports.githubUrl = async () => {
  try {
    const repoName = await exports.remoteRepo()

    return `https://github.com/${repoName}/`
  } catch (error) {
    throw error
  }
}

exports.createPullRequestUrl = async (defaultBranch = 'master') => {
  try {
    const currentBranch = await exports.currentBranch()
    const githubUrl = await exports.githubUrl()

    return `${githubUrl}compare/${defaultBranch}...${currentBranch}`
  } catch (error) {
    throw error
  }
}
