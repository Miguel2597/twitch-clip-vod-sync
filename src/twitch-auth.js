const axios = require('axios')
const utils = require('./utils')
const Token = require('./models/token')

const { TWITCH_API_AUTH_URL, CLIENT_ID, CLIENT_SECRET } = process.env

const validateToken = async () => {
    try{
        let token = await Token.findOne({ expiresAt: { $gte: new Date()} })

        if(!token){
            token = await generateAccessToken()
        }

        const { access_token } = token

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

const generateAccessToken = async () => {
    try{
        const data = await axios.post(`${TWITCH_API_AUTH_URL}/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`)

        const { access_token, expires_in } = data.data

        const token = await new Token({
            access_token: access_token,
            expiresAt: utils.addTimeToDate(new Date(), [expires_in])
        }).save()

        return token

    }catch(err){
        throw err
    }
}

module.exports = { validateToken }