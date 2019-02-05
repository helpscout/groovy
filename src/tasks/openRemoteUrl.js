const execa = require('execa')
const {getGithubUrlFromRemoteOrigin} = require('../utils')

exports.openRemoteUrl = async () => {
  console.log('Opening Github Repo...')

  try {
    const {stdout: remoteOrigin} = await execa('git', [
      'remote',
      'get-url',
      'origin',
    ])

    const githubUrl = getGithubUrlFromRemoteOrigin(remoteOrigin)

    execa.shell(`open ${githubUrl}`)
  } catch (err) {
    throw err
  }
}
