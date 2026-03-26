import { tokenSDK } from "./key.js";
import { fetchWebApi } from "./request.js";
import { updateRange } from "./layout.js";
import { durationObserver } from './Observer.js';

let id_device;
let isShuffle = false;
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

  player.addListener('player_state_changed', state => {
    if (!state) return;

    const {
      paused,
      position,
      duration,
      track_window: { current_track }
    } = state;

    // console.log('Зараз грає:', current_track.name);
    // console.log('Статус паузи:', paused);
    // console.log('Позиція відтворення:', position, 'з', duration);

    durationObserver.broadcast(duration);
  });

  setInterval(() => {
    player.getCurrentState().then((state) => {
      if (!state) {
        // console.error('User is not playing music through the Web Playback SDK');
      } else {
        document.getElementById("range").value = Math.floor(state.position / 1000) * 1000;
        updateRange();
      }
    })
  }, 250)

  document.getElementById("range").addEventListener("input", (e) => {
    player.seek(e.target.value);
  })

  document.getElementById("next_track").addEventListener("click", () => {
    player.nextTrack();
  })

  document.getElementById("prev_track").addEventListener("click", () => {
    player.previousTrack();
  })

  document.getElementById("play").addEventListener("click", () => {
    player.togglePlay()
  })


  document.body.addEventListener("dblclick", (e) => {
    let uri;

    if (e.target.closest(".list_item")) {
      uri = e.target.closest(".list_item").classList.value;
    } else { return }

    if (uri.includes("spotify")) {
      listItem = uri.match(/(?<=spotify\_)\w+/)[0].split("_");
    }

    playURI(listItem[0], listItem[1]);

  })

}

// ---------------------------------------------------------------


async function playURI(typeList, id) {
  let body;
  if (typeList === "track") {
    body = { "uris": [`spotify:track:${id}`] };
  } else {
    body = {
      context_uri: `spotify:${typeList}:${id}`,
      offset: { position: 0 },
      position_ms: 0
    }
  }
  return (await fetchWebApi(`https://api.spotify.com/v1/me/player/play?device_id=${id_device}`, 'PUT', body));
}

async function playShuffle() {
  isShuffle = !isShuffle;
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/shuffle?state=${isShuffle}&device_id=${id_device}`, 'PUT'
  )
}

async function repeatPlaylist() {
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

document.getElementById("shuffle").addEventListener("click", async () => {
  playShuffle();
})

document.getElementById("repeat").addEventListener("click", async () => {
  repeatPlaylist();
})