export { updatePlayBtns }
import { tokenSDK } from "./key.js";
import { fetchWebApi } from "./request.js";
import { updateRange, updateVolumeIcon } from "./layout.js";
import { durationObserver } from './Observer.js';
import { parseURI, getURIClass } from "./helper.js";
import { makeFullAlbum, getAlbum } from "./makeAlbum.js";
import { makeFullArtistAlbumsList } from "./makeArtistAlbumsList.js";
import { makeFullPlaylist, getPlaylist } from "./makePlaylist.js";
import { showPlayingTrack } from "./showPlayingTrack.js";


let id_device;
let shuffle;
let repeat_mode;
let paused;
let position;
let duration;
let listItem;
let uri = '';
let current_list_uri_class = '';
let current_track_uri_class = '';
let playing_track_uri_class = '';
let icon_elements = document.getElementsByClassName('icon');
let clickTimer = null;

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
    // current_list_uri_class = state.context.uri.replaceAll(':', '_');
    current_track_uri_class = (state.track_window.current_track.linked_from.uri || state.track_window.current_track.uri).replaceAll(':', '_');

    // console.log('Зараз грає:', state.track_windowcurrent_track.name);
    // console.log('Статус паузи:', paused);
    // console.log('Позиція відтворення:', position, 'з', duration);
    console.log(state);
    // console.log(current_list_uri_class)
    // console.log(current_track_uri_class)
    if (current_track_uri_class !== playing_track_uri_class) {
      showPlayingTrack(state.track_window.current_track);
      playing_track_uri_class = current_track_uri_class;
    }

    styleShuffleBtn(shuffle);
    styleRepeatBtn(repeat_mode);
    checkPlayBtn(paused);
    updatePlayBtns(paused);

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

  document.getElementById("volume_wrap").addEventListener("wheel", (e) => {
    if (e.deltaY > 0) volume.value = Number(volume.value) - 5
    else volume.value = Number(volume.value) + 5;
    player.setVolume(volume.value / 100);
    updateVolumeIcon();
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
    if (e.target.closest(".list_item")) {
      uri = getURIClass(e.target.closest(".list_item").classList.value);
    } else { return }
    let offset = uri.replaceAll('_', ':');
    if (offset.split(":")[1] === "artist") return
    else if (["playlist", "album"].includes(offset.split(":")[1])) current_list_uri_class = offset.replaceAll(':', '_');
    else if (offset.split(":")[1] === "track") {
      current_list_uri_class = start_section.children[1].className;
    }
    updatePlayBtns(paused);
    playList(uri, offset)
    // .then(Promise.all([setShuffleList(false), setRepeatList('off')]));
  })


  document.body.addEventListener('click', (e) => {
    if (clickTimer) {
      clearTimeout(clickTimer);
      clickTimer = null;
      return;
    }
    clickTimer = setTimeout(() => {
      if (e.target.closest('.list_item')) {
        let uriArr = parseURI(e.target.closest('.list_item').className);
        switch (uriArr[1]) {
          case "album":
            makeFullAlbum(uriArr[2]);
            break;
          case "artist":
            makeFullArtistAlbumsList(uriArr[2]);
            break;
          case "playlist":
            makeFullPlaylist(uriArr[2]);
            break;
        }
      }
      clickTimer = null;
    }, 200)
  })
}


// ---------------------------------------------------------------

async function getListTracks(uri) {
  let list;
  let listURI = parseURI(uri);
  // current_list_uri_class = uri;
  if (listURI[1] === "playlist") {
    list = await getPlaylist(listURI[2]);
    list = list.items.items.map(el => el.track.uri);
  }
  if (listURI[1] === "album") {
    list = await getAlbum(listURI[2]);
    list = list.tracks.items.map(el => el.uri);
  }
  if (listURI[1] === "track") {
    let item = document.getElementsByClassName(uri);
    list = [...item[0].parentElement.children].reduce((prevArr, el) => {
      if (el.classList.contains('list_item')) {
        prevArr.push(getURIClass(el.classList.value).replaceAll('_', ':'));
        return prevArr;
      } else return prevArr;
    }, [])
  }
  return list;
}


async function playList(uri, offset) {
  let list;
  let listItem = parseURI(uri);
  // current_list_uri_class = uri;
  let bodyArr = await getListTracks(uri);
  let body = { "uris": bodyArr };

  if (parseURI(offset.replaceAll(':', '_'))[1] === "track") body.offset = { "uri": offset }
  else body.offset = { "position": 0 };
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


function icon_btn_pause() {
  return '<use href="./images/icons.svg#pause_pl"></use>'
}

function icon_btn_play() {
  return '<use href="./images/icons.svg#play_pl"></use>'
}

function icon_all_play() {
  let playBtn = document.querySelectorAll('.list_item div>svg');
  for (let i = 0; i < playBtn.length; i++) {
    playBtn[i].innerHTML = icon_btn_play();
  }
}

function activatePlayingItem() {
  if (current_track_uri_class) {
    let current_track = document.querySelectorAll(`.${current_track_uri_class} .artist_play_btn`);
    for (let i = 0; i < current_track.length; i++) {
      current_track[i].classList.add('active_item');
    }

    current_track = document.querySelectorAll(`.${current_track_uri_class} .play_btn`);
    for (let i = 0; i < current_track.length; i++) {
      current_track[i].classList.add('active_item');
    }
  }

  if (current_list_uri_class) {
    let current_list = document.querySelectorAll(`.my_pl_item.${current_list_uri_class} .play_btn`);
    for (let i = 0; i < current_list.length; i++) {
      current_list[i].classList.add('active_item');
    }

    current_list = document.querySelectorAll(`.my_pl_item.${current_list_uri_class} p`)[0];
    if (current_list) current_list.classList.add('playing_list');

    current_list = document.querySelectorAll(`#artist_tracks .${current_list_uri_class} .play_btn`);
    for (let i = 0; i < current_list.length; i++) {
      current_list[i].classList.add('active_item');
    }
  }
}

function clearActivatePlayingItem() {
  let items = document.querySelectorAll('.active_item');
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove('active_item');
  }
  items = document.querySelectorAll('.playing_list');
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove('playing_list');
  }
}

function updatePlayBtns(pause) {
  icon_all_play();

  if (!pause) {
    clearActivatePlayingItem()
    activatePlayingItem();
    let item_icons = document.querySelectorAll('.list_item div>svg');
    for (let i = 0; i < item_icons.length; i++) {
      if ([current_list_uri_class, current_track_uri_class].includes(getURIClass(item_icons[i].closest(".list_item").classList.value))) {
        item_icons[i].innerHTML = `${icon_btn_pause()}`;
      }
    }
  }
}

async function listArr(uri) {
  let listArr = await getPlaylist("4dhl1GQkOHCdi3VBPoxSys");
  return listArr;
}

function checkPlayBtn(paused) {
  let play_btn = document.querySelector('#play>svg');
  let iconPlayBtn = paused ? 'play' : 'pause';
  play_btn.innerHTML = `<use href="./images/icons.svg#${iconPlayBtn}"></use>`;
}