const Listr = require('listr')
const execa = require('execa')
const {get} = require('lodash')
const prompts = require('prompts')
const git = require('../git')
const {getTrelloConfig, getDefaultBranch} = require('./getConfig')
const trello = require('../trello')
const {getNewPullRequestUrlFromRemoteOrigin, open} = require('../utils')

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/'/g, '%27')
}

exports.createPullRequest = async trelloUrl => {
  console.log('Creating Pull Request...')

  const {key, token} = await getTrelloConfig()
  let trelloCard
  let trelloCardUrl

  if (key && token) {
    if (trello.isTrelloCardUrl(trelloUrl)) {
      trelloCardUrl = trelloUrl
    } else {
      const urlPrompt = await prompts({
        type: 'text',
        name: 'url',
        message: 'Trello Card URL',
        initial: 'Press enter to skip',
      })

      trelloCardUrl = urlPrompt.url
    }

    trelloCard = await trello.getCard(trelloCardUrl)
  }

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
        return (async () => {
          ctx.defaultBranch = await getDefaultBranch()
        })()
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

          let pullRequestUrl = getNewPullRequestUrlFromRemoteOrigin({
            defaultBranch,
            origin: remoteOrigin,
            currentBranch,
          })

          if (trelloCard) {
            let {name, description} = trelloCard
            const encodedTitle = fixedEncodeURIComponent(name)

            if (trelloCardUrl) {
              description = `**[Trello Card](${trelloCardUrl})**\n\n${description}`
            }

            const encodedBody = fixedEncodeURIComponent(description)

            pullRequestUrl = `${pullRequestUrl}?title=${encodedTitle}&body=${encodedBody}`
          }

          return openPage(`"${pullRequestUrl}"`)
        })()
      },
    },
  ]

  const command = new Listr(tasks)

  command.run()
}
