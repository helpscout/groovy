const {get} = require('lodash')
const {getGlobalConfig, getConfig} = require('../explorer')
const {constants} = require('../constants')

exports.getTrelloConfig = async () => {
  const explorer = getGlobalConfig()
  const results = await explorer.search()
  const config = get(results, 'config', {})

  const trello_key = config[constants.TRELLO_KEY]
  const trello_token = config[constants.TRELLO_KEY]

  if (!trello_key || !trello_token) return {}

  return {
    key: config[constants.TRELLO_KEY],
    token: config[constants.TRELLO_TOKEN],
  }
}

exports.getDefaultBranch = async () => {
  const explorer = getConfig()
  const results = await explorer.search()
  const config = get(results, 'config', {})

  return config[constants.defaultBranch] || 'master'
}
