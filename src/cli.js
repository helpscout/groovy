#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const openGithub = require('./tasks/openGithub')
const {createPullRequest} = require('./tasks/createPullRequest')
const {openCoverageReport} = require('./tasks/openCoverageReport')
const {configTrello} = require('./tasks/configTrello')
const {test} = require('./tasks/test')
const argv = require('yargs').argv

console.log()

// Usage
program.usage(`

  🔮  Enso
  enso <command>

  Example:
  enso open`)

program.version(pkg.version)

program
  .command('config')
  .alias('i')
  .description('Configures Enso')
  .option('', 'Configures an .ensorc.json file')
  .option('trello', 'Sets up Trello integration')
  // .option('--branch', 'Default git branch for configuration')
  .option('--key', 'API key for configuration')
  .option('--token', 'API token for configuration')
  .action(command => {
    const {key, token} = argv
    if (command === 'trello') {
      return configTrello({key, token})
    }

    // return config()
  })

program
  .command('open')
  .description('Opens project in a browser')
  .alias('o')
  .option('', 'Opens Github repo')
  .option('coverage', 'Opens coverage report')
  .option('pr', 'Opens Github pull requests')
  .option('issues', 'Opens Github issues')
  .option('ci', 'Opens Travis CI')
  .action(command => {
    if (command === 'coverage') {
      return openCoverageReport()
    }

    if (command === 'issues') {
      return openGithub.openIssues()
    }

    if (['pr', 'prs', 'pulls'].some(w => w === command)) {
      return openGithub.openPullRequests()
    }

    if (command === 'ci') {
      return openGithub.openCI()
    }

    return openGithub.openRemote()
  })

program
  .command('create')
  .alias('c')
  .description('Executes a creation task')
  .option('pr', 'Creates a pull request on Github')
  .action((command, url) => {
    if (command === 'pr') {
      return createPullRequest(url)
    }
  })

program
  .command('test')
  .alias('t')
  .description('Runs tests via npm test')
  .action(test)

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
