// import { searchResult } from "./fetchesResults/searchResult.js";


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

let clickTimer = null;



async function getSearchResult(searchText) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=${encodeURIComponent("track,playlist,album,artist")}&limit=10`, 'GET'
  ));
}

// let searchResult = await getSearchResult('Paramore');

// searchFullList(searchResult);


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

