import { playlist } from "./fetchesResults/getPlaylist.js";
import { albumTracks } from "./fetchesResults/albumTracks.js";
import { album } from "./fetchesResults/getAlbum.js";
import { artistsAlbums } from "./fetchesResults/getArtistAlbums.js";
import { artist } from "./fetchesResults/getArtist.js";
import { searchResult } from "./fetchesResults/searchResult.js";


import { fetchWebApi } from "./request.js";
import { makeFullPlaylist } from "./makePlaylist.js";
import { makeFullTracksList } from "./makeTracksList.js";
import { makeFullAlbum } from "./makeAlbum.js";
import { makeFullArtistAlbumsList } from "./makeArtistAlbumsList.js";
import { makeUserList } from "./userLists.js";
import { currentUser } from "./currentUser.js";
import { searchFullList } from "./searchList.js";


// async function getPlaylist(id) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/playlists/${id}`, 'GET'
//   ));
// }


// async function getAlbum(id) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/albums/${id}`, 'GET'
//   ));
// }


// async function getAlbumList(id) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/albums/${id}/tracks?market=UA&limit=50`, 'GET'
//   ));
// }

// async function getArtist(id) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/artists/${id}`, 'GET'
//   ));
// }

// async function getArtistAlbums(id) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album&market=UA&limit=10`, 'GET'
//   ));
// }

// async function getSearchResult(searchText) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchText)}&type=${encodeURIComponent("track,playlist,album,artist")}&market=UA&limit=10`, 'GET'
//   ));
// }

// let playlist = await getPlaylist("2iZTFETkt7Qr6tbETaJDh4");
// let album = await getAlbum("6tG8sCK4htJOLjlWwb7gZB");
// let albumTracks = await getAlbumList("6tG8sCK4htJOLjlWwb7gZB");
// let artist = await getArtist("74XFHRwlV6OrjEM0A2NCMF");
// let artistsAlbums = await getArtistAlbums("74XFHRwlV6OrjEM0A2NCMF");
// let searchResult = await getSearchResult('Paramore');


makeUserList();
// currentUser();
// makeFullTracksList();

searchFullList(searchResult);

// makeFullPlaylist(playlist);
// makeFullAlbum(albumTracks, album);
// makeFullArtistAlbumsList(artistsAlbums, artist);



document.getElementById('logo').addEventListener('click', () => {
  makeFullTracksList();
})

document.getElementById('central_side').addEventListener('click', () => {
  makeFullAlbum(albumTracks, album);
})