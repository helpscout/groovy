const Listr = require('listr')
const prompts = require('prompts')
const git = require('../git')
const config = require('../config')
const {getTrelloConfig, getDefaultBranch} = require('./getConfig')
const trello = require('../trello')
const {openPage} = require('../utils')

function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/'/g, '%27')
}

exports.createPullRequest = async (trelloUrl = '') => {
  console.log('Creating Pull Request...')

  const {key, token} = await getTrelloConfig()
  const localCachedTrelloCard = await config.getBranchTrelloCard()

  let trelloCard
  let trelloCardUrl

  if (key && token) {
    if (trello.isTrelloCardUrl(trelloUrl)) {
      process.exit(0)

      trelloCardUrl = trelloUrl
    } else if (localCachedTrelloCard) {
      trelloCardUrl = localCachedTrelloCard
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
      task: () => git.pushCurrentBranch(),
    },
    {
      title: 'Creating Pull Request',
      task: ctx => {
        return (async () => {
          const {defaultBranch} = ctx

          let pullRequestUrl = await git.createPullRequestUrl(defaultBranch)

          if (trelloCard) {
            let {name, description} = trelloCard
            const encodedTitle = fixedEncodeURIComponent(name)

            if (trelloCardUrl) {
              description = `**[Trello Card](${trelloCardUrl})**\n\n${description}`
            }

            const encodedBody = fixedEncodeURIComponent(description)

            pullRequestUrl = `${pullRequestUrl}?title=${encodedTitle}&body=${encodedBody}`
          }

          return openPage(pullRequestUrl)
        })()
      },
    },
  ]

  const command = new Listr(tasks)

  command.run()
}
