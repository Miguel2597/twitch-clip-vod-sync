// check if a clip url matches the regex expression
const isClipUrlValid = (url) => /^(?:https:\/\/)?clips\.twitch\.tv\/([^\/\s]+)$/.test(url) || 
                                /^(?:https:\/\/)?(?:www\.)?twitch\.tv\/(\S+)\/clip\/([^\/\s]+)$/.test(url)

// check if a vod url matches the regex expression
const isVodUrlValid = (url) => /^(?:https:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\S+)\?t=\d+h[0-5]?[0-9]m[0-5]?[0-9]s$/.test(url)

// check if array is empty
const isDataEmpty = (data) => data.length === 0

// Adds hours, minutes and seconds to a date and returns a new Date object 
const addTimeToDate = (date, arr) => {
    if(arr.length === 1) return new Date(date.getTime() + (arr[0]*1000))

    if(arr.length === 2) return new Date(date.getTime() + (arr[0]*60*1000) + (arr[1]*1000))

    return new Date(date.getTime() + (arr[0]*60*60*1000) + (arr[1]*60*1000) + (arr[2]*1000))
}

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

// convert hours to days
const hoursToDays = (hours) => Math.floor(hours / 24)

module.exports = { isClipUrlValid, isVodUrlValid, isDataEmpty, addTimeToDate, dateDiff, hoursToDays }