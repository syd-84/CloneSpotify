import { tokenSDK } from "./key.js";
import { fetchWebApi } from "./request.js";
import { updateRange } from "./layout.js";
import { durationObserver } from './Observer.js';
import { parseURI, getURIClass } from "./helper.js";

let id_device;
let shuffle;
let repeat_mode;
let paused;
let position;
let duration;
let listItem;
let uri;
let current_list_uri_class;
let current_track_uri_class;
let icon_elements = document.getElementsByClassName('icon');

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

  player.addListener('player_state_changed', state => {
    if (!state) return;

    ({
      paused,
      position,
      duration,
      shuffle,
      repeat_mode,
    } = state)
    current_list_uri_class = state.context.uri.replaceAll(':', '_');
    current_track_uri_class = state.track_window.current_track.uri.replaceAll(':', '_');

    // console.log('Зараз грає:', current_track.name);
    // console.log('Статус паузи:', paused);
    // console.log('Позиція відтворення:', position, 'з', duration);
    console.log(state);
    // console.log(current_list_uri_class)
    // console.log(current_track_uri_class)

    styleShuffleBtn(shuffle);
    styleRepeatBtn(repeat_mode);
    stylePlayBtn(paused);

    durationObserver.broadcast(duration);

    if (paused) {
      let current_playing_element = document.querySelectorAll(`.${current_list_uri_class || current_track_uri_class}>.icon`);
      for (let i = 0; i < current_playing_element.length; i++) {
        current_playing_element[i].children[1].innerHTML = icon_btn_play()
      }
    }

    if (!paused) {
      let current_playing_element = document.querySelectorAll(`.${current_list_uri_class || current_track_uri_class}>.icon`);
      for (let i = 0; i < current_playing_element.length; i++) {
        current_playing_element[i].children[1].innerHTML = icon_btn_pause()
      }
    }

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
    icon_all_play();

    if (e.target.closest(".list_item")) {
      uri = e.target.closest(".list_item").classList.value;
    } else { return }

    listItem = parseURI(uri);

    playURI(listItem[1], listItem[2])
    // .then(() => {
    //   Promise.all([setShuffleList(false), setRepeatList('off')]);
    // })
  })


  for (let i = 0; i < icon_elements.length; i++) {
    icon_elements[i].addEventListener('click', (e) => {
      // icon_all_play();
      uri = icon_elements[i].closest(".list_item").classList.value;
      listItem = parseURI(uri);

      if (paused === undefined) {
        playURI(listItem[1], listItem[2])
        icon_elements[i].children[1].innerHTML = icon_btn_pause();
      }

      if (paused) {
        player.resume()
        icon_elements[i].children[1].innerHTML = icon_btn_pause();
      }

      let paused_btn = document.querySelectorAll(`.${listItem.join('_')} use`)
      if (!paused) {
        for (let i = 0; i < paused_btn.length; i++) {
          if (paused_btn[i].href.baseVal.includes('pause_pl')) {
            player.pause()
          }
        }
      }

      if (getURIClass(uri) !== (current_list_uri_class || current_track_uri_class)) {
        playURI(listItem[1], listItem[2]);
        player.pause();
        icon_all_play();
        icon_elements[i].children[1].innerHTML = icon_btn_pause();
      }

    })
  }

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

async function changeShuffleList(shuffle) {
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/shuffle?state=${!shuffle}&device_id=${id_device}`, 'PUT'
  )
}

async function setShuffleList(shuffle) {
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/shuffle?state=${shuffle}&device_id=${id_device}`, 'PUT'
  )
}

function styleShuffleBtn(shuffle) {
  shuffle
    ? document.getElementById("shuffle").classList.add("active_btn_icon")
    : document.getElementById("shuffle").classList.remove("active_btn_icon")
}

document.getElementById("shuffle").addEventListener("click", async () => {
  changeShuffleList(shuffle);
  styleShuffleBtn(shuffle);
})

async function changeRepeatList() {
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
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/repeat?state=${state}&device_id=${id_device}`, 'PUT'
  )
}

async function setRepeatList(state) {
  await fetchWebApi(
    `https://api.spotify.com/v1/me/player/repeat?state=${state}&device_id=${id_device}`, 'PUT'
  )
}

function styleRepeatBtn(repeat_mode) {
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
  styleRepeatBtn(repeat_mode);
})

function stylePlayBtn(paused) {
  let id_icon = paused ? 'pause' : 'play';
  document.getElementById('play').innerHTML = `<svg><use href="./images/icons.svg#${id_icon}"></use></svg>`
}


function icon_btn_pause() {
  return '<div><svg width="24" height="24"><use href="./images/icons.svg#pause_pl"></use></svg></div>'
}

function icon_btn_play() {
  return '<div><svg width="24" height="24"><use href="./images/icons.svg#play_pl"></use></svg></div>'
}

function icon_all_play() {
  for (let i = 0; i < icon_elements.length; i++) {
    icon_elements[i].children[1].innerHTML = icon_btn_play();
  }
}

