// import { playlist } from "./fetchesResults/getPlaylist.js";
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


async function getPlaylist(id) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/playlists/${id}`, 'GET'
  ));
}

async function getPlaylistItems(id) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/playlists/${id}/items?market=UA&limit=50`, 'GET'
  ));
}

async function getSearchResult(searchText) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=${encodeURIComponent("track,playlist,album,artist")}&market=UA&limit=10`, 'GET'
  ));
}

let playlist = await getPlaylist("1CZcfiWe3wJHyjWhgSyL6D");
// let searchResult = await getSearchResult('Paramore');


makeUserList();
// currentUser();
// makeFullTracksList();

// searchFullList(searchResult);

// makeFullPlaylist(playlist);
// makeFullAlbum(albumTracks, album);
// makeFullArtistAlbumsList(artistsAlbums, artist);



document.getElementById('logo').addEventListener('click', () => {
  makeFullTracksList();
})

document.body.addEventListener('click', (e) => {
  let uriArr = parseURI(e.target.closest('.list_item').className);
  if (uriArr[1] === "album") {
    makeFullAlbum(uriArr[2]);
  }
  if (uriArr[1] === "artist") {
    makeFullArtistAlbumsList(uriArr[2]);
  }
})