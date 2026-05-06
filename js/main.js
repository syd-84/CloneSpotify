import { fetchWebApi } from "./request.js";
import { makeFullPlaylist } from "./makePlaylist.js";
import { makeFullTracksList } from "./makeTracksList.js";
import { makeFullAlbum } from "./makeAlbum.js";
import { makeFullArtistAlbumsList } from "./makeArtistAlbumsList.js";
import { makeUserList } from "./userLists.js";
import { currentUser } from "./currentUser.js";
import { searchFullList } from "./searchList.js";
import { getURIClass, parseURI } from "./helper.js";
import { updatePlayBtns } from "./player.js";
import { devices } from "./devices.js";
import { pauseObserver } from './Observer.js';


let clickTimer = null;

currentUser();
makeUserList();
makeFullTracksList();

document.getElementById('logo').addEventListener('click', async () => {
  await makeFullTracksList();
  updatePlayBtns();
})

document.body.addEventListener('click', async (e) => {
  if (clickTimer) {
    clearTimeout(clickTimer);
    clickTimer = null;
    return;
  }
  clickTimer = setTimeout(async () => {
    if (e.target.classList.contains("point")) {
      let uriArr = parseURI(e.target.className);
      switch (uriArr[1]) {
        case "artist":
          {
            await makeFullArtistAlbumsList(uriArr[2]);
            updatePlayBtns();
          }
          break;
        case "album":
          {
            await makeFullAlbum(uriArr[2]);
            updatePlayBtns();
          } break;
      }
    }
    clickTimer = null;
  }, 200)
})

async function search() {
  let searchTag = document.querySelector('#search input');
  let searchText = searchTag.value;
  await searchFullList(searchText);
  updatePlayBtns();
}

document.getElementById('search_icon').addEventListener('click', search);
document.querySelector('#search input').addEventListener('keydown', (e) => {
  if (e.code === "Enter") search();
})


document.getElementById('device').addEventListener('click', async (e) => {
  if (document.getElementById("devices_list") === null) {
    await devices();
    const list = document.getElementById('devices_list');
    list.style.bottom = `70px`;
    list.style.right = `50px`;
  }
})

document.body.addEventListener('click', (e) => {
  if (document.getElementById("devices_list") !== null && !e.target.closest('#devices_list')) {
    document.getElementById("overlay").remove();
    document.getElementById("devices_list").remove();
  };
})

async function putDevice(id) {
  let play;
  pauseObserver.subscribe((paused) => {
    play = !paused;
  });
  const body = {
    "device_ids": [id],
    "play": play
  };
  return (await fetchWebApi(
    `https://api.spotify.com/v1/me/player`, 'PUT', body
  ));
}

document.body.addEventListener('click', (e) => {
  if (e.target.closest('#devices_list')) {
    let device_id = e.target.className.match(/(?<=device_id_)\w+/)[0];
    document.getElementById("overlay").remove();
    document.getElementById("devices_list").remove();
    putDevice(device_id);
  }
})