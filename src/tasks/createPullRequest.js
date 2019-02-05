const Listr = require('listr')
const execa = require('execa')
const {get} = require('lodash')
const {getNewPullRequestUrlFromRemoteOrigin} = require('../utils')
const git = require('../git-utils')

const {getConfig} = require('../explorer')
const explorer = getConfig()

exports.createPullRequest = () => {
  console.log('Creating Pull Request...')

  const tasks = [
    {
      title: 'Check local working tree',
      task: () => git.verifyWorkingTreeIsClean(),
    },
    {
      title: 'Check remote history',
      task: () => git.verifyRemoteHistoryIsClean(),
    },
    {
      title: 'Getting Config',
      task: ctx => {
        return explorer.search().then(results => {
          const config = get(results, 'config')
          if (!config) return Promise.reject()

          const {default_branch, trello_key, trello_token} = config

          ctx.defaultBranch = default_branch || 'master'
          ctx.key = trello_key
          ctx.token = trello_token

          return Promise.resolve()
        })
      },
    },
    {
      title: 'Pushing to Remote',
      task: ctx => {
        return (async () => {
          const {stdout: remoteOrigin} = await execa('git', [
            'remote',
            'get-url',
            'origin',
          ])
          const {stdout: currentBranch} = await execa('git', [
            'rev-parse',
            '--abbrev-ref',
            'HEAD',
          ])

          ctx.remoteOrigin = remoteOrigin
          ctx.currentBranch = currentBranch

          return execa('git', ['push', '-u', 'origin', currentBranch])
        })()
      },
    },
    {
      title: 'Creating Pull Request',
      task: ctx => {
        return (async () => {
          const {defaultBranch, remoteOrigin, currentBranch} = ctx
          const pullRequestUrl = getNewPullRequestUrlFromRemoteOrigin({
            defaultBranch,
            origin: remoteOrigin,
            currentBranch,
          })

          await execa.shell(`open ${pullRequestUrl}`)
        })()
      },
    },
  ]

  const command = new Listr(tasks)

  command.run()
}
