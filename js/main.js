// import { searchResult } from "./fetchesResults/searchResult.js";


import { fetchWebApi } from "./request.js";
import { fetchWebApiBarer } from "./requestBarer.js";
import { makeFullPlaylist } from "./makePlaylist.js";
import { makeFullTracksList } from "./makeTracksList.js";
import { makeFullAlbum } from "./makeAlbum.js";
import { makeFullArtistAlbumsList } from "./makeArtistAlbumsList.js";
import { makeUserList } from "./userLists.js";
import { currentUser } from "./currentUser.js";
import { searchFullList } from "./searchList.js";
import { getURIClass, parseURI } from "./helper.js";


async function getSearchResult(searchText) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=${encodeURIComponent("track,playlist,album,artist")}&market=UA&limit=10`, 'GET'
  ));
}

// let searchResult = await getSearchResult('Paramore');

// searchFullList(searchResult);


currentUser();
makeUserList();
makeFullTracksList();

document.getElementById('logo').addEventListener('click', () => {
  makeFullTracksList();
})

document.body.addEventListener('click', (e) => {
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
})