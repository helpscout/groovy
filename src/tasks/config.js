const fs = require('fs')
const path = require('path')
const pkgUp = require('pkg-up')
const {get} = require('lodash')
const prompts = require('prompts')
const {constants} = require('../constants')

const {getConfig} = require('../explorer')
const explorer = getConfig()

exports.config = async () => {
  console.log()
  console.log('Configuring Git for Enso...')
  console.log()

  const results = await explorer.search()
  const config = get(results, 'config', {})

  const pkg = await pkgUp()
  const projectPath = path.dirname(pkg)
  const configPath = path.resolve(
    projectPath,
    `.${constants.CONFIG_NAME}rc.json`
  )
  const {default_branch} = config

  if (default_branch) {
    console.log('Enso has already been configured')
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
    if (err) {
      console.log("Enso wasn't able to be configured.")
      console.log(err)
    }

    console.log()
    console.log('Awesome! 🤘')
    console.log('Enso has been configured.')
  })
}
