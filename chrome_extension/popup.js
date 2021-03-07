document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        const url = tabs[0].url
        if(isClipUrlValid(url) || isVodUrlValid(url)) document.getElementById('myURL').value = url
    })

    document.getElementById("myBtn").addEventListener("click", fetchData);
})

const isClipUrlValid = (url) => /^(?:https:\/\/)?clips\.twitch\.tv\/(\S+)$/.test(url)

const isVodUrlValid = (url) => /^(?:https:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\S+)\?t=\d+h\d+m\d+s$/.test(url)

const fetchData = async () => {
    document.getElementById('myVod').style.display = 'none'
    document.getElementById("myBtn").style.display = 'none'
    document.getElementById("mySpinner").style.display = 'block'

    const url = document.getElementById("myURL").value
    const username = document.getElementById("myUsername").value

    try{
        const res = await fetch(`https://twitch-clip-vod-sync.herokuapp.com?url=${url}&username=${username}`)
        const data = await res.json()

        if(data.vod){
            document.getElementById('myVod')
            .innerHTML = `<p>${data.streamer}'s perspective</p>` + `<a href="${data.vod}" target="_blank" rel="noopener noreferrer">${data.vod}</a>`
        }else{
            document.getElementById('myVod')
            .innerHTML =  `<p>${data.message}</p>`
        }
        
        document.getElementById("mySpinner").style.display = 'none'
        document.getElementById("myBtn").style.display = 'block'
        document.getElementById('myVod').style.display = 'block'

    }catch(err){
        console.log(err)
    }
}