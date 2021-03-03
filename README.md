# Twitch clip/VOD sync

App that synchronises a Twitch clip/VOD to another streamers VOD if that streamer was live at the exact moment in time of the respective clip/VOD.

This app is currently a single endpoint hosted on Heroku that accepts requests, it does not have a frontend. You can send a request to https://twitch-clip-vod-sync.herokuapp.com?url={url}&username={username}, where:

* {url} is the url of the clip/VOD you are watching.
* {username} is the username of the streamer whose perspective you want to watch.