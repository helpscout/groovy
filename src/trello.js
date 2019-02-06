const {getTrelloConfig} = require('./tasks/getConfig')
const axios = require('axios')

// Parses the Card's url to retrieve the Trello short ID
//
// Example:
// https://trello.com/c/edT7SLj1/18-3-hs-activation-switch
// The shortID would be edT7SLj1
const getShortIdFromUrl = url => {
  const matches = url.match(/(https:\/\/trello.com\/c\/)(.*?)(?=\/)/)
  return matches ? matches[2] : ''
}

const stripPointsFromName = name => {
  return name.replace(/^\((\d*)\)/g, '').trim()
}

const remapCardToProps = card => {
  const {name, desc} = card

  return {
    name: stripPointsFromName(name),
    description: desc,
  }
}

exports.isTrelloCardUrl = url =>
  url && url.indexOf('https://trello.com/c/') === 0

exports.getCard = async url => {
  if (!url || url.indexOf('https://trello.com/c/') < 0) return

  try {
    const {key, token} = await getTrelloConfig()

    if (!key && !token) return

    const shortId = getShortIdFromUrl(url)

    const api = axios.create({
      baseURL: 'https://api.trello.com/1/',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      params: {key, token},
    })

    const {data} = await api.get(
      `cards/${shortId}?attachments=false&attachment_fields=all&members=false&membersVoted=false&checkItemStates=false&checklists=all&checklist_fields=all&board=false&list=false&pluginData=false&stickers=false&sticker_fields=all&customFieldItems=false`
    )

    return remapCardToProps(data)
  } catch (err) {
    throw err
  }
}
