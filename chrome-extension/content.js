chrome.runtime.onMessage.addListener( (request, sender, sendResponse) => {
    if(request === 'vodUrl' && document.querySelector('[data-a-target="player-seekbar-current-time"]')){
        const element = document.querySelector('[data-a-target="player-seekbar-current-time"]')
        sendResponse({ timestamp: element.innerText })
    }else{
        sendResponse()
    }
})
