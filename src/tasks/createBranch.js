const git = require('../git')
const trello = require('../trello')
const config = require('../config')

exports.createBranch = async name => {
  console.log('Creating git branch...')

  const isTrelloCard = trello.isTrelloCardUrl(name)

  let branchName = name
  if (isTrelloCard) {
    branchName = trello.getCardNameFromUrl(name)
  }

  try {
    await git.newBranch(branchName)
    console.log(`${branchName} branch was created!`)

    // Cache to Groovy
    const localRepo = await git.localRepo()

    if (isTrelloCard) {
      config.set(localRepo, name)
    }
  } catch (err) {
    console.log("Hmm! Groovy couldn't create a git branch")
  }
}
