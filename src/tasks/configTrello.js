const fs = require('fs')
const path = require('path')
const {get} = require('lodash')
const prompts = require('prompts')
const {getHomeDir} = require('../utils')
const {constants} = require('../constants')

const {getGlobalConfig} = require('../explorer')
const explorer = getGlobalConfig()

exports.configTrello = async () => {
  console.log()
  console.log('Configuring Trello for Enso...')
  console.log()
  console.log('Enso will need your Trello API key and token')
  console.log('These can be found at: https://trello.com/app-key')
  console.log()

  const results = await explorer.search()
  const config = get(results, 'config', {})
  const configPath = path.resolve(
    getHomeDir(),
    `.${constants.GLOBAL_CONFIG_NAME}rc.json`
  )
  const {trello_key, trello_token} = config

  if (trello_key && trello_token) {
    console.log('Enso has already been configured with Trello')
    console.log('Key:', trello_key)
    console.log('Token:', trello_token)
    console.log()

    const confirm = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Set up new key/token values? (Default: y)',
      initial: true,
    })

    if (!confirm.value) return
  }

  const apiKey = await prompts({
    type: 'text',
    name: 'value',
    message: 'API Key?',
    validate: value =>
      !value ? `This is required to use Trello with Enso` : true,
  })

  const apiToken = await prompts({
    type: 'text',
    name: 'value',
    message: 'API Token?',
    validate: value =>
      !value ? `This is required to use Trello with Enso` : true,
  })

  if (!apiKey.value && !apiToken.value) {
    console.log("Enso wasn't able to set up your Trello API key and token.")
    return
  }

  console.log()
  console.log('Key:', apiKey.value)
  console.log('Token:', apiToken.value)
  console.log()

  const confirm = await prompts({
    type: 'confirm',
    name: 'value',
    message: 'Does this look correct?',
    initial: true,
  })

  if (!confirm.value) {
    return
  }

  config[constants.TRELLO_KEY] = apiKey.value
  config[constants.TRELLO_TOKEN] = apiToken.value

  fs.writeFile(configPath, JSON.stringify(config), err => {
    if (err) {
      console.log("Enso wasn't able to set up your Trello API key and token.")
      console.log(err)
    }

    console.log()
    console.log('Awesome! 🤘')
    console.log('Enso has set up your Trello API key and token.')
  })
}
