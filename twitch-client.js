const axios = require('axios')
const utils = require('./utils')

// create an axios istance with predefined headers and base url
const instance = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
        'Client-Id': process.env.CLIENT_ID
    }
})

// get the streamer id based on the username passed as parameter
const getStreamerId = async (username) => {
    try{
        // send request to /users endpoint to get the data for the specified username
        const userData = await instance.get(`/users?login=${username}`)

        return userData.data.data[0]['id']
    }catch(err){
        return err.response.data.message
    }
}

// get the creation date of the clip based on the url passed as parameter
const getClipDate = async (url) => {
    try{
        // check if url is valid
        if(utils.isUrlValid(url)){

            // extract clip id from the url
            let clipId = url.substring(url.lastIndexOf('/') + 1)

            // send request to /clips endpoint to get the data for the specified clip id
            const clipData = await instance.get(`/clips?id=${clipId}`)

            // request does not return an error if clip does not exist, so check if it exists
            if(!utils.clipExists(clipData.data.data)) throw new Error('Clip does not exist')

            return clipData.data.data[0]['created_at']
        }else{
            throw new Error('Invalid url')
        }
    }catch(err){
        return err.message
    }
}

module.exports = { getClipDate, getStreamerId }

