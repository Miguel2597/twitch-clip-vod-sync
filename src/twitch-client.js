const axios = require('axios')
const utils = require('./utils')

const { TWITCH_API_URL, CLIENT_ID } = process.env

class TwitchClient{
    constructor(access_token){
        this.access_token = access_token

        // create an axios instance to use the twitch api
        this.instance = axios.create({
            baseURL: TWITCH_API_URL,
            headers: {
                'Authorization': `Bearer ${this.access_token}`,
                'Client-Id': CLIENT_ID
            }
        })
    }

    async getStreamerInfo(username){
        try{
            // send request to /users endpoint to get the data for the specified username
            const userData = await this.instance.get(`/users?login=${username}`)
    
            // check if the user exists
            if(utils.isDataEmpty(userData.data.data)) throw new Error()
    
            const { id, display_name, profile_image_url } = userData.data.data[0]
    
            return { id, display_name, profile_image_url }
    
        }catch(err){
            throw new Error('The specified username does not exist')
        }
    }

    async getExactDate(url){
        try{
            const vod = {}
    
            // if url is a clip
            if(url.includes('clip')){
                url = url.split(/[?#]/)[0]
                const clipId = url.substring(url.lastIndexOf('/') + 1)
        
                // send request to /clips endpoint to get the data for the specified clip id
                var clipData = await this.instance.get(`/clips?id=${clipId}`)

                

                clipData = clipData.data.data[0]
        
                // get the vod
                const videoId = clipData.video_id
        
                // Check if the vod still exists
                if(!videoId) throw new Error('The VOD for this clip has been deleted')
        
                vod.id = videoId
                if(clipData.vod_offset){
                    vod.timeOffset = clipData.vod_offset
                }else{
                    vod.timeOffset = 0
                }
        
            }else{
                // extract vod id from the url
                vod.id = url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('?'))
                vod.url = url
            }
        
            // send request to /videos endpoint to get the data for the specified vod id
            const vodInfo = await this.instance.get(`/videos?id=${vod.id}`)

            // get the vod start date
            const vodStart = vodInfo.data.data[0]['created_at']

            // get the vod duration
            const duration = vodInfo.data.data[0].duration.split(/\D+/).filter(e => e)

            if(vod.timeOffset){
                var t = new Date(vodStart);
                t.setSeconds(t.getSeconds() + vod.timeOffset);
                return t
            }

            else{
                // separate the vod timestamp hours, minutes, seconds into an array
                const timestamp = new URL(vod.url).searchParams.get('t').split(/\D+/).filter(e => e)

                
                
                // if timestamp in the url > duration of the vod, invalid timestamp
                if(utils.addTimeToDate(new Date(), timestamp) > utils.addTimeToDate(new Date(), duration)) throw new Error('The VOD timestamp cannot be bigger than the vod duration')
            
                
            
                // add the vod timestamp to the start date of the vod
                return utils.addTimeToDate(new Date(vodStart), timestamp)
            }

            
    
        }catch(err){
            if(err.isAxiosError) throw new Error('Clip does not exist')
            
            throw err
        }
    }

    async getSyncedVod(streamerInfo, exactDate){
        try{
            // calculate the difference between today's date and the date of the clip/vod so the request only returns the needed number of vods
            // add + 5 just in case the streamer has more than 1 vod per day
            const firstVods = utils.hoursToDays(utils.dateDiff(new Date(), exactDate).h) + 5
    
            // send request to /videos endpoint to get the the VODs for the specified streamer
            const vodsData = await this.instance.get(`/videos?user_id=${streamerInfo.id}&first=${firstVods}&type=archive`)
    
            // check if the streamer has any vods
            if(utils.isDataEmpty(vodsData.data.data)) throw new Error(`${streamerInfo.display_name} does not have any available VODs`)
    
            const vod = this.findVod(vodsData.data.data, exactDate)
    
            // check if a vod is found
            if(!vod) throw new Error(`${streamerInfo.display_name} was not streaming at the time of the clip/VOD or the VOD has been deleted`)
    
            // calculate the difference between the date and the vod start date
            const { h, m, s } = utils.dateDiff(exactDate, vod.startDate)
            
            // return the final vod url with the timestamp
            return `${vod.url}?t=${h}h${m}m${s}s`
    
        }catch(err){
            throw err
        }
    }

    findVod(vods, exactDate){
        for(let vod of vods){
            // separate duration hours, minutes, seconds into an array
            const duration = vod.duration.split(/\D+/).filter(e => e)
    
            // get the vod start date
            const vodStart = new Date(vod['created_at'])
    
            // get the vod end date
            const vodEnd = utils.addTimeToDate(vodStart, duration)
    
            // if the date is in between the start and end dates return vod info
            if(exactDate.getTime() >= vodStart.getTime() && exactDate.getTime() <= vodEnd.getTime()){
                return { url: vod.url, startDate: vodStart }
            }
        }
        return false
    }
}

module.exports = TwitchClient