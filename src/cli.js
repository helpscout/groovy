#!/usr/bin/env node
const program = require('commander')
const pkg = require('../package.json')
const openGithub = require('./tasks/openGithub')
const {createBranch} = require('./tasks/createBranch')
const {createPullRequest} = require('./tasks/createPullRequest')
const {openCoverageReport} = require('./tasks/openCoverageReport')
const {configTrello} = require('./tasks/configTrello')
const {configGroovy} = require('./tasks/configGroovy')
const config = require('./config')
const argv = require('yargs').argv

console.log()

// Usage
program.usage(`

  🕺  Groovy (v${pkg.version})
  gv <command>

  Example:
  gv open`)

program.version(pkg.version)

program
  .command('config')
  .alias('c')
  .description('Configures Groovy')
  .option('', 'Configures an .groovyrc.json file')
  .option('trello', 'Sets up Trello integration')
  // .option('--branch', 'Default git branch for configuration')
  .option('--key', 'API key for configuration')
  .option('--token', 'API token for configuration')
  .action(command => {
    const {key, token} = argv
    if (command === 'trello') {
      return configTrello({key, token})
    }

    if (command === 't') {
      return config.set()
    }

    return configGroovy()
  })

program
  .command('open')
  .description("Open somethin' in a browser")
  .alias('o')
  .option('', 'Opens Github repo')
  .option('coverage', 'Opens coverage report (Alias: cov, cv)')
  .option('pr', 'Opens Github pull requests')
  .option('issues', 'Opens Github issues')
  .option('ci', 'Opens Travis CI')
  .action(command => {
    if (['coverage', 'cov', 'cv'].some(w => w === command)) {
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
  .command('new')
  .alias('n')
  .description("Create somethin' new")
  .option('<name/url>', 'Creates a Git branch (Alias: b)')
  .option('pr <url>', 'Creates a pull request on Github (Alias: prs, pulls)')
  .action((command, arg) => {
    const validArg = typeof arg === 'string' ? arg : undefined
    const validCmd = typeof command === 'string' ? command : undefined

    if (['pr', 'prs', 'pulls'].some(w => w === command)) {
      return createPullRequest(validArg)
    }

    return createBranch(validCmd || validArg)
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
