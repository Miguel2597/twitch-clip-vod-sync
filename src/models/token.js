const mongoose = require('mongoose')
const { Schema } = mongoose

const tokenSchema = new Schema({
    access_token: { type: String, required: true },
    generatedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, expires: 0}
})

module.exports = mongoose.model('Token', tokenSchema)