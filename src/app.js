require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const TwitchClient = require('./twitch-client')
const twitchAuth = require('./twitch-auth')
const utils = require('./utils')

const { PORT, MONGO_DB } = process.env

const app = express()

app.get('/', async (req, res) => {
    try{
        const { url, username } = req.query

        // check if the url is valid
        if(!utils.isClipUrlValid(url) && !utils.isVodUrlValid(url)) throw new Error('Invalid clip/VOD URL')

        // get an access token
        const access_token = await twitchAuth.validateAccessToken()

        const client = new TwitchClient(access_token)

        const streamerInfo = await client.getStreamerInfo(username)
        const exactDate = await client.getExactDate(url)
        const finalVod = await client.getSyncedVod(streamerInfo, exactDate)
        
        res.json({ 
            streamer: streamerInfo.display_name,
            streamer_profile_image: streamerInfo.profile_image_url,
            vod: finalVod
        })

    }catch(err){
        res.json({ message: err.message })
    }
})

const port = PORT || 3000

mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
.catch(err => console.log(err))

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    app.listen(port, () => {
        console.log(`Running on port ${port}`)
    })
});
