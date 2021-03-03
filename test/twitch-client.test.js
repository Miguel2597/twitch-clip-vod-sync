require('dotenv').config()
require('./utils.test')
const { assert } = require('chai')
const twitchClient = require('../src/twitch-client')

describe('twitch-client.js Tests', () => {
    describe('getStreamerInfo() Test', () => {
        it('should return the correct streamer info', async () => {
            const result = await twitchClient.getStreamerInfo('lirik')
            assert.deepEqual(result, { id: '23161357', display_name: 'LIRIK' })
        })

        it('should return an error message', async () => {
            try{
                await twitchClient.getStreamerInfo('qwwfwqwqfqw')
            }catch(err){
                assert.strictEqual(err.message, 'User does not exist')
            }
        })

        it('should return an error message', async () => {
            try{
                await twitchClient.getStreamerInfo('lirik qwq')
            }catch(err){
                assert.strictEqual(err.message, 'User does not exist')
            }
        })
    })

    describe('getExactDate() Test', () => {
        it('should return the date of the clip/vod', async () => {
            const result = await twitchClient.getExactDate('https://clips.twitch.tv/AgileEagerGooseDAESuppy-mLvrVTMtS-JKVuja')
            assert.deepEqual(result, new Date('2021-03-02T00:46:04.000Z'))
        })

        it('should return an error message', async () => {
            try{
                await twitchClient.getExactDate('https://clips.twitch.tv/AgileEagerGooseDAESuppy-mLvrVTMtS-JKVuj')
            }catch(err){
                assert.strictEqual(err.message, 'Clip does not exist or the vod for this clip has been removed')
            }
        })
    })

    describe('getSyncedVod() Test', () => {
        it('should return the vod', async () => {
            const result = await twitchClient.getSyncedVod({ id: '23161357', display_name: 'LIRIK' }, new Date('2021-03-02T00:46:04.000Z'))
            assert.strictEqual(result, 'https://www.twitch.tv/videos/933079737?t=7h37m56s')
        })

        it('should return an error message', async () => {
            try{
                await twitchClient.getSyncedVod({ id: '45912064', display_name: 'Saab' }, new Date('2021-03-02T00:46:04.000Z'))
            }catch(err){
                assert.strictEqual(err.message, 'Saab does not have any available VODs')
            }
        })

        it('should return an error message', async () => {
            try{
                await twitchClient.getSyncedVod({ id: '19571641', display_name: 'Ninja' }, new Date('2021-03-02T00:46:04.000Z'))
            }catch(err){
                assert.strictEqual(err.message, 'Ninja was not streaming at the time of the clip/vod or the vod was deleted')
            }
        })
    })
})