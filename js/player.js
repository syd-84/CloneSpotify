import { tokenSDK } from "./key.js";
import { fetchWebApi } from "./request.js";

let id_device;
let isShufle = false;
let isRepeat = 0;
let listItem;

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = tokenSDK;
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); },
    volume: 0.5
  });

  player.addListener('ready', ({ device_id }) => {
    id_device = device_id;
  })

  player.connect();

  document.getElementById("next_track").addEventListener("click", () => {
    player.nextTrack();
  })

  document.getElementById("prev_track").addEventListener("click", () => {
    player.previousTrack();
  })

  document.getElementById("play").addEventListener("click", () => {
    player.togglePlay()
  })

}



async function playPlaylist(typeList, id) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/me/player/play?device_id=${id_device}`, 'PUT',
    {
      context_uri: `spotify:${typeList}:${id}`,
      offset: { position: 0 },
      position_ms: 0
    }
  ));
}

async function playTrack(id) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/me/player/play?device_id=${id_device}`, 'PUT',
    {
      "uris": [`spotify:track:${id}`]
    }
  ));
}

async function playShuffle() {
  isShufle = !isShufle;
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/shuffle?state=${isShufle}&device_id=${id_device}`, 'PUT'
  )
}

async function repeatPlalist() {
  let state;
  switch (isRepeat % 3) {
    case 0:
      state = "off"
      break;
    case 1:
      state = "context"
      break;
    case 2:
      state = "track"
      break;
  }
  isRepeat++;
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/repeat?state=${state}&device_id=${id_device}`, 'PUT'
  )
}

document.body.addEventListener("dblclick", (e) => {
  let uri;

  if (e.target.closest(".list_item")) {
    uri = e.target.closest(".list_item").classList.value;
  } else if (e.target.closest(".my_pl_item")) {
    uri = e.target.closest(".my_pl_item").classList.value;
  } else { return }

  if (uri.includes("spotify")) {
    listItem = uri.match(/(?<=spotify\_)\w+/)[0].split("_");
  }

  if (listItem[0] === "track") {
    playTrack(listItem[1])
  } else {
    playPlaylist(listItem[0], listItem[1])
  }

  isShufle = true;
  playShuffle();

  isRepeat = 0;
  repeatPlalist();

})

document.getElementById("shuffle").addEventListener("click", async () => {
  playShuffle();
})

document.getElementById("repeat").addEventListener("click", async () => {
  repeatPlalist();
})