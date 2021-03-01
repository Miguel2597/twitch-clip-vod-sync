require('dotenv').config()
const twitchClient = require('./twitch-client')

const vod = async (clipUrl, username) => {
    try{
        const streamerInfo = await twitchClient.getStreamerInfo(username)
        const clipDate = await twitchClient.getClipDate(clipUrl)
        const finalVod = await twitchClient.getStreamerVodTimestamp(streamerInfo, clipDate)
        console.log(finalVod)
    }catch(err){
        console.log(err.message)
    }
}

vod('https://clips.twitch.tv/DeliciousRoundHeronANELE-8ih31js816okhmo7', 'koil')
