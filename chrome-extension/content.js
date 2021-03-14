chrome.runtime.onConnect.addListener(port => {
    port.onMessage.addListener(msg => {
        if(msg === 'vodUrl'){
            const element = document.querySelector('[data-a-target="player-seekbar-current-time"]')
            port.postMessage({ timestamp: element.innerText })
        }
    })
})
