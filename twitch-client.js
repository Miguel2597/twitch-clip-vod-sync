const axios = require('axios')
const utils = require('./utils')

// create an axios instance to use the twitch api
const instance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'Client-Id': process.env.CLIENT_ID
    }
})

// create another axios instance to use the old twitch api to get a vod timestamp through a clip
// the new twitch api does not provide this info
const instance2 = axios.create({
    baseURL: process.env.BASE_URL_2,
    headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': process.env.CLIENT_ID
    }
})

// get the streamer id and display name based on the username passed as parameter
const getStreamerInfo = async (username) => {
    // send request to /users endpoint to get the data for the specified username
    const userData = await instance.get(`/users?login=${username}`)

    // check if the user exists
    if(!utils.isDataNotEmpty(userData.data.data)) throw new Error('User does not exist')

    const { id, display_name } = userData.data.data[0]

    return { id, display_name }
}

// get the creation date of the clip based on the clip url passed as parameter
const getClipDate = async (url) => {
    // check if url is valid
    if(!utils.isUrlValid(url)) throw new Error('Invalid url')

    // extract clip id from the url
    const clipId = url.substring(url.lastIndexOf('/') + 1)

    // send request to /clips endpoint to get the data for the specified clip id
    const clipData = await instance2.get(`/clips/${clipId}`)

    // get the vod
    const vod = clipData.data.vod

    // Check if the vod still exists
    if(!vod) throw new Error('The vod for this clip has been removed')

    // separate the vod timestamp hours, minutes, seconds into an array
    const timeStampArr = vod.url.substring(vod.url.lastIndexOf('=') + 1).split(/[hms]+/)

    // send request to /videos endpoint to get the data for the specified vod id
    const vodInfo = await instance.get(`/videos?id=${vod.id}`)

    // get the vod start date
    const vodStart = vodInfo.data.data[0]['created_at']

    return utils.addTimeToDate(new Date(vodStart), timeStampArr)
}

// get the specified's streamer vod timestamp that corresponds to the date of the clip passed as parameter
const getStreamerVodTimestamp = async (streamerInfo, clipDate) => {
    // send request to /videos endpoint to get the the VODs for the specified streamer
    const vodsData = await instance.get(`/videos?user_id=${streamerInfo.id}`)

    // check if the streamer has any vods
    if(!utils.isDataNotEmpty(vodsData.data.data)) throw new Error(`${streamerInfo.display_name} does not have any available VODs`)

    const vod = findVod(vodsData.data.data, clipDate)

    // check if a vod is found
    if(!vod) throw new Error(`${streamerInfo.display_name} was not streaming at the time of the specified clip`)

    // calculate the difference between the clip date and the vod start date
    const { h, m, s } = utils.dateDiff(clipDate, vod.startDate)
    
    return `${vod.url}?t=${h}h${m}m${s}s`
}

// find a vod
const findVod = (vods, clipDate) => {
    for(vod of vods){
        // separate duration hours, minutes, seconds into an array
        const hoursArr = vod.duration.split(/[hms]+/)

        // get the vod start date
        const vodStart = new Date(vod['created_at'])

        // get the vod end date
        const vodEnd = utils.addTimeToDate(vodStart, hoursArr)

        // if the clip date is in between the start and end dates return vod info
        if(clipDate.getTime() >= vodStart.getTime() && clipDate.getTime() <= vodEnd.getTime()){
            return {
                url: vod.url,
                startDate: vodStart
            }
        }
    }
    return false
}

module.exports = { getClipDate, getStreamerInfo, getStreamerVodTimestamp }

