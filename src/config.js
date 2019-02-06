const fs = require('fs')
const path = require('path')
const git = require('./git')
const {getGlobalConfig} = require('./explorer')
const {constants} = require('./constants')
const {getHomeDir} = require('./utils')

const explorer = getGlobalConfig()

const logError = () => {
  console.log(
    "Hmm! Couldn't find Groovy's global config. Try running gv config."
  )
}

exports.configPath = path.resolve(
  getHomeDir(),
  `.${constants.GLOBAL_CONFIG_NAME}rc.json`
)

exports.get = async () => {
  try {
    const {config} = await explorer.search()
    return config
  } catch (err) {
    logError()
  }
}

exports.set = async (key, value) => {
  try {
    const config = await exports.get()
    if (!config[key]) {
      config[key] = value
    }

    return fs.writeFile(exports.configPath, JSON.stringify(config), err => {
      if (err) {
        return Promise.reject(err)
      }
      return Promise.resolve(config)
    })
  } catch (err) {
    logError()
  }
}

exports.getBranchTrelloCard = async () => {
  try {
    const localRepo = await git.localRepo()
    return exports.get(localRepo)
  } catch (err) {
    logError()
  }
}
