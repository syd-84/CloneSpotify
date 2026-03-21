import { tokenSDK } from "./key.js";
import { fetchWebApi } from "./request.js";

let id_device;

// ------------- get id of device -------------
window.onSpotifyWebPlaybackSDKReady = () => {
  const token = tokenSDK;
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
  });

  // Ready
  player.addListener('ready', ({ device_id }) => {
    console.log('Ready with Device ID', device_id);
    id_device = device_id;
  })

  player.connect();

}


// ------------- player -------------

async function tempRequest(id) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/me/player/devices`, 'GET'
  ));
}

document.getElementById('play').onclick = async function () {
  const temp = await tempRequest()
  console.dir(temp);
};