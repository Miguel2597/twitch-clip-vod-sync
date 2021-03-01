const { assert } = require('chai')
const utils = require('../utils')

describe('utils.js tests', () => {
    describe('isClipUrlValid() Test', () => {
        it('should be equal to true', () => {
            const url = 'https://clips.twitch.tv/ShortPrettyMonkeyUncleNox-22NRB0sbsBMBA08N'
            const result = utils.isClipUrlValid(url)
            assert.strictEqual(result, true)
        })

        it('should be equal to true', () => {
            const url = 'clips.twitch.tv/ShortPrettyMonkeyUncleNox-22NRB0sbsBMBA08N'
            const result = utils.isClipUrlValid(url)
            assert.strictEqual(result, true)
        })

        it('should be equal to false', () => {
            const url = 'https://twitch.tv/ShortPrettyMonkeyUncleNox-22NRB0sbsBMBA08N'
            const result = utils.isClipUrlValid(url)
            assert.strictEqual(result, false)
        })

        it('should be equal to false', () => {
            const url = 'https://clips.twitch.tv/'
            const result = utils.isClipUrlValid(url)
            assert.strictEqual(result, false)
        })
    })

    describe('isVodUrlValid() Test', () => {
        it('should be equal to true', () => {
            const url = 'https://www.twitch.tv/videos/928480589?t=3h48m30s'
            const result = utils.isVodUrlValid(url)
            assert.strictEqual(result, true)
        })

        it('should be equal to true', () => {
            const url = 'twitch.tv/videos/928480589?t=3h48m30s'
            const result = utils.isVodUrlValid(url)
            assert.strictEqual(result, true)
        })

        it('should be equal to false', () => {
            const url = 'https://www.twitch.tv/videos/928480589'
            const result = utils.isVodUrlValid(url)
            assert.strictEqual(result, false)
        })

        it('should be equal to false', () => {
            const url = 'https://www.twitch.tv/videos?t=3h48m30s'
            const result = utils.isVodUrlValid(url)
            assert.strictEqual(result, false)
        })

        it('should be equal to false', () => {
            const url = 'https://www.twitch.tv/videos?t=348m30'
            const result = utils.isVodUrlValid(url)
            assert.strictEqual(result, false)
        })
    })

    describe('isDataEmpty() Test', () => {
        it('should be equal to true', () => {
            const result = utils.isDataEmpty([])
            assert.strictEqual(result, true)
        })

        it('should be equal to false', () => {
            const result = utils.isDataEmpty([1, 2, 3])
            assert.strictEqual(result, false)
        })
    })

    describe('addTimeToDate() Test', () => {
        it('should return the correct date', () => {
            const date = new Date('2021-03-01T23:10:00Z')
            const result = utils.addTimeToDate(date, [1, 20, 30])
            assert.deepEqual(result, new Date('2021-03-02T00:30:30Z'))
        })
    })

    describe('dateDiff() Test', () => {
        it('should return the correct difference between dates', () => {
            const date1 = new Date('2021-03-01T17:10:37Z')
            const date2 = new Date('2021-03-01T20:30:00Z')
            const result = utils.dateDiff(date1, date2)
            assert.deepEqual(result, { h: 3, m: 19, s: 23 })
        })
    })

})