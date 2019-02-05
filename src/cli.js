#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const {openRemoteUrl} = require('./tasks/openRemoteUrl')
const {createPullRequest} = require('./tasks/createPullRequest')
const {openCoverageReport} = require('./tasks/openCoverageReport')
const {config} = require('./tasks/config')
const {configTrello} = require('./tasks/configTrello')
const {test} = require('./tasks/test')

// Usage
program.usage(`

  🔮  Enso
  enso <command>

  Example:
  enso open`)

program.version(pkg.version)

program
  .command('config')
  .description('Configures Enso')
  .option('', 'Configures an .ensorc.json file')
  .option('trello', 'Sets up Trello integration')
  .action(command => {
    if (command === 'trello') {
      return configTrello()
    }

    return config()
  })

program
  .command('open')
  .description('Opens project in a browser')
  .option('', 'Opens Github repo')
  .option('coverage', 'Opens coverage report')
  .action(command => {
    if (command === 'coverage') {
      return openCoverageReport()
    }

    return openRemoteUrl()
  })

program
  .command('create')
  .description('Executes a creation task')
  .option('pr', 'Creates a pull request on Github')
  .action(command => {
    if (command === 'pr') {
      return createPullRequest()
    }
  })

program
  .command('test')
  .description('Runs tests via npm test')
  .action(test)

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
