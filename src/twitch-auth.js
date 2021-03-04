const axios = require('axios')
const utils = require('./utils')
const Token = require('./models/token')

const { TWITCH_API_AUTH_URL, CLIENT_ID, CLIENT_SECRET } = process.env

// validate an access token
const validateAccessToken = async () => {
    try{
        // find an access token
        let token = await Token.findOne({ expiresAt: { $gte: new Date()} })

        // if an access token is not found, generate a new one
        if(!token){
            token = await generateAccessToken()
        }

        const { access_token } = token

        // send a request to /validate endpoint to validate the token
        await axios.get(`${TWITCH_API_AUTH_URL}/validate`, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })

        return access_token
    
    }catch(err){
        throw err
    }
}

// generate a new access token
const generateAccessToken = async () => {
    try{
        // send a request to /token to generate a new access token
        const tokenData = await axios.post(`${TWITCH_API_AUTH_URL}/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`)

        const { access_token, expires_in } = tokenData.data

        // save the new token in the database
        const token = await new Token({
            access_token: access_token,
            expiresAt: utils.addTimeToDate(new Date(), [expires_in])
        }).save()

        return token

    }catch(err){
        throw err
    }
}

module.exports = { validateAccessToken }