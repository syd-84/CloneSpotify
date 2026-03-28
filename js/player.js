import { tokenSDK } from "./key.js";
import { fetchWebApi } from "./request.js";
import { updateRange } from "./layout.js";
import { durationObserver } from './Observer.js';
import { parseURI } from "./helper.js";

let id_device;
let shuffle;
let repeat_mode;
let paused;
let position;
let duration;
let listItem;

window.onSpotifyWebPlaybackSDKReady = () => {
  const token = tokenSDK;
  const player = new Spotify.Player({
    name: 'Web Playback SDK Quick Start Player',
    getOAuthToken: cb => { cb(token); },
    volume: localStorage.getItem("spotifyCloneVol") / 100,
  });

  player.addListener('ready', ({ device_id }) => {
    id_device = device_id;
  })

  player.connect();

  player.pause();

  player.addListener('player_state_changed', state => {
    if (!state) return;

    ({
      paused,
      position,
      duration,
      shuffle,
      repeat_mode,
    } = state)

    // console.log('Зараз грає:', current_track.name);
    // console.log('Статус паузи:', paused);
    // console.log('Позиція відтворення:', position, 'з', duration);
    console.log(state);

    styleShuffleList(shuffle);
    styleRepeatList(repeat_mode);
    stylePlayBtn(paused);

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

  document.getElementById("volume").addEventListener("input", (e) => {
    player.setVolume(e.target.value / 100);
  })

  document.getElementById("volume_svg").addEventListener("click", (e) => {
    player.setVolume(localStorage.getItem("spotifyCloneVol") / 100);
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

    listItem = parseURI(uri);

    playURI(listItem[0], listItem[1])
    // .then(() => {
    //   Promise.all([setShuffleList(false), setRepeatList('off')]);
    // })
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

function changeShuffleList(shuffle) {
  setShuffleList(!shuffle)
}

async function setShuffleList(shuffle) {
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}&device_id=${id_device}`, 'PUT'
  )
}

function styleShuffleList(shuffle) {
  shuffle
    ? document.getElementById("shuffle").classList.add("active_btn_icon")
    : document.getElementById("shuffle").classList.remove("active_btn_icon")
}

document.getElementById("shuffle").addEventListener("click", async () => {
  changeShuffleList(shuffle);
  styleShuffleList(shuffle);
})

function changeRepeatList() {
  let state;
  switch (repeat_mode) {
    case 0:
      state = "context"
      break;
    case 1:
      state = "track"
      break;
    case 2:
      state = "off"
      break;
  }
  setRepeatList(state);
}

async function setRepeatList(state) {
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/repeat?state=${state}&device_id=${id_device}`, 'PUT'
  )
}

function styleRepeatList(repeat_mode) {
  switch (repeat_mode) {
    case 0:
      document.getElementById('repeat').classList.remove('active_btn_icon');
      document.getElementById('repeat').innerHTML = '<svg><use href="./images/icons.svg#repeat"></use></svg>'
      break;
    case 1:
      document.getElementById('repeat').classList.add('active_btn_icon');
      document.getElementById('repeat').innerHTML = '<svg><use href="./images/icons.svg#repeat"></use></svg>'
      break;
    case 2:
      document.getElementById('repeat').classList.add('active_btn_icon');
      document.getElementById('repeat').innerHTML = '<svg><use href="./images/icons.svg#repeat_track"></use></svg>'
      break;
  }
}

document.getElementById("repeat").addEventListener("click", async () => {
  changeRepeatList();
  styleRepeatList(repeat_mode);
})

function stylePlayBtn(paused) {
  let id_icon = paused ? 'pause' : 'play';
  document.getElementById('play').innerHTML = `<svg><use href="./images/icons.svg#${id_icon}"></use></svg>`
}