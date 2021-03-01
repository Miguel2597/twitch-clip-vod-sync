const axios = require('axios')
const utils = require('./utils')

// create an axios instance with predefined headers and base url
const instance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'Client-Id': process.env.CLIENT_ID
    }
})

// get the streamer id based on the username passed as parameter
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
    const clipData = await instance.get(`/clips?id=${clipId}`)

    // check if the clip exists
    if(!utils.isDataNotEmpty(clipData.data.data)) throw new Error('Clip does not exist')

    return clipData.data.data[0]['created_at']
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

