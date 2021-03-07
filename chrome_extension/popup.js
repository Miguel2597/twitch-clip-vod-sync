const myURL = document.getElementById('myURL')
const myUsername = document.getElementById("myUsername")
const myBtn = document.getElementById("myBtn")
const mySpinner = document.getElementById("mySpinner")
const myVod = document.getElementById('myVod')
const myImg = document.getElementById('myImg')
const myPar = document.getElementById('myPar')
const myLink = document.getElementById('myLink')
const myError = document.getElementById('myError')
const myPar2 = document.getElementById('myPar2')

document.addEventListener('DOMContentLoaded', () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        const url = tabs[0].url
        if(isClipUrlValid(url) || isVodUrlValid(url)) myURL.value = url
    })

    myBtn.addEventListener("click", fetchData);
})

const isClipUrlValid = (url) => /^(?:https:\/\/)?clips\.twitch\.tv\/(\S+)$/.test(url)

const isVodUrlValid = (url) => /^(?:https:\/\/)?(?:www\.)?twitch\.tv\/videos\/(\S+)\?t=\d+h\d+m\d+s$/.test(url)

const fetchData = async () => {
    myError.style.display = 'none'
    myVod.style.display = 'none'
    myBtn.style.display = 'none'
    mySpinner.style.display = 'block'

    const url = myURL.value
    const username = myUsername.value

    try{
        const res = await fetch(`https://twitch-clip-vod-sync.herokuapp.com?url=${url}&username=${username}`)
        const data = await res.json()

        if(data.vod){
            // myVod.innerHTML = + `<a href="${data.vod}" target="_blank" rel="noopener noreferrer">${data.vod}</a>`
            myImg.src = data.streamer_profile_image
            myPar.innerText = `${data.streamer}'s perspective:`
            myLink.href = data.vod
            myLink.innerText = data.vod
            myVod.style.display = 'block'
        }else{
            myPar2.innerText = data.message
            myError.style.display = 'block'
        }
        
        mySpinner.style.display = 'none'
        myBtn.style.display = 'block'

    }catch(err){
        console.log(err)
    }
}