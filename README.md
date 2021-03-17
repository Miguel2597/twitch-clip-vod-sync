# Twitch clip/VOD sync
Synchronises a Twitch clip/VOD to another streamers VOD if that streamer was live at the exact moment in time of the clip/VOD.

You can use this extension anywhere as long as you provide a valid clip/VOD URL. If you have a clip/VOD open in your current tab, the extension will automatically fill in the URL field for you.

Get the chrome extension [here](https://chrome.google.com/webstore/detail/twitch-clipvod-sync/iolfhmhipbbpacmhhffkjelgkadnffid).

![extension](chrome-extension/images/extension.gif)

## Valid clip URLs examples

```
https://clips.twitch.tv/ObliqueOddCougarFunRun-GF9H5eK6aSyFbT8U
clips.twitch.tv/ObliqueOddCougarFunRun-GF9H5eK6aSyFbT8U
twitch.tv/lirik/clip/EphemeralMuddyPanPeteZarollTie-D-ojcu-Nk40osS0S
```

## Valid VOD URLs examples
VOD URLs must always include a timestamp with hours, minutes and seconds, even if they are 0.

```
https://www.twitch.tv/videos/934247376?t=10h29m46s
www.twitch.tv/videos/934247376?t=0h15m12s
twitch.tv/videos/934247376?t=1h0m10s
```
