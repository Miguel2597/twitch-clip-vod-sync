require('dotenv').config()
const express = require('express')
const twitchClient = require('./twitch-client')
const utils = require('./utils')

const app = express()

app.get('/clipvodsync', async (req, res) => {
    try{
        const { url, username } = req.query

        // check if the url is valid
        if(!utils.isClipUrlValid(url) && !utils.isVodUrlValid(url)) throw new Error('Invalid url')

        const streamerInfo = await twitchClient.getStreamerInfo(username)
        const exactDate = await twitchClient.getExactDate(url)
        const finalVod = await twitchClient.getSyncedVod(streamerInfo, exactDate)
        
        res.json({ streamer: streamerInfo.display_name, vod: finalVod })
    }catch(err){
        res.json({ message: err.message })
    }
})

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
