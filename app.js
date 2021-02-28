require('dotenv').config()
const twitchClient = require('./twitch-client')

twitchClient.getClipDate('https://clips.twitch.tv/AbnegateFilthyGaurOhMyDog-zueJrl0ylDOMSjNt')
.then(data => console.log(`clip created at: ${data}`))

twitchClient.getStreamerId('xqcow')
.then(data => console.log(`user id for username xqcow: ${data}`))