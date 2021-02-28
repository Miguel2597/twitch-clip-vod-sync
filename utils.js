// check if url matches regex expression
const isUrlValid = (url) => {
    return /^(?:https:\/\/)?clips\.twitch\.tv\/(\S+)$/.test(url)
}

// check if data array is empty
const clipExists = (data) => {
    return data.length !== 0
}

module.exports = { isUrlValid, clipExists }