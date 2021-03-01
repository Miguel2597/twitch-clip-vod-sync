require('dotenv').config()
const twitchClient = require('./twitch-client')
const utils = require('./utils')

const vod = async (url, username) => {
    try{
        // check if the url is valid
        if(!utils.isClipUrlValid(url) && !utils.isVodUrlValid(url)) throw new Error('Invalid url')

        const streamerInfo = await twitchClient.getStreamerInfo(username)
        const exactDate = await twitchClient.getExactDate(url)
        const finalVod = await twitchClient.getSyncedVod(streamerInfo, exactDate)
        
        console.log(finalVod)
    }catch(err){
        console.log(err.message)
    }
}

vod('https://www.twitch.tv/videos/928480589?t=3h48m30s', 'ssaab')
