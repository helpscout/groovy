const fs = require('fs')
const path = require('path')
const {get} = require('lodash')
const prompts = require('prompts')
const {constants} = require('../constants')
const {getProjectPath} = require('../utils')

const {getConfig} = require('../explorer')
const explorer = getConfig()

exports.configGroovy = async () => {
  try {
    console.log('Configuring Git for Groovy...')
    console.log()

    const results = await explorer.search()
    const config = get(results, 'config', {})

    const projectPath = await getProjectPath()
    const configPath = path.resolve(
      projectPath,
      `.${constants.CONFIG_NAME}rc.json`
    )
    const {default_branch} = config

    if (default_branch) {
      console.log('Groovy has already been configured')
      console.log('default_branch:', default_branch)
      console.log()

      return
    }

    const defaultBranch = await prompts({
      type: 'text',
      name: 'value',
      message: 'What is your default git branch?',
      initial: 'master',
    })

    config[constants.DEFAULT_BRANCH] = defaultBranch.value

    fs.writeFile(configPath, JSON.stringify(config), err => {
      console.log()
      console.log('Right on! 🤘')
      console.log('Groovy has been configured.')
    })
  } catch (err) {
    console.log("Groovy wasn't able to be configured.")
    console.log(err)
  }
}
