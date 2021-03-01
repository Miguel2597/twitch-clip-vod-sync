// Adds hours, minutes and seconds to a date and returns a new Date object 
Date.prototype.addTime = function(h, m, s){
    return new Date(this.getTime() + (h*60*60*1000) + (m*60*1000) + (s*1000))
}

// check if a clip url matches the regex expression
const isClipUrlValid = (url) => /^(?:https:\/\/)?clips\.twitch\.tv\/(\S+)$/.test(url)

// check if a vod url matches the regex expression
const isVodUrlValid = (url) => /^(?:https:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\S+)\?t=\d+h\d+m\d+s$/.test(url)

// check if data array is not empty
const isDataEmpty = (data) => data.length === 0

// add hours, minutes, seconds to a date
const addTimeToDate = (date, arr) => date.addTime(...arr)

// returns the difference between 2 dates in hours, minutes, seconds
const dateDiff = (date1, date2) => {
    let ms = Math.abs(date1 - date2)

    let s = Math.floor(ms / 1000)
    let m = Math.floor(s / 60)
    s %= 60
    let h = Math.floor(m / 60)
    m %= 60

    return { h, m, s }
}

module.exports = { isClipUrlValid, isVodUrlValid, isDataEmpty, addTimeToDate, dateDiff }