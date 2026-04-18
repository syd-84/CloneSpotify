import { playlist } from "./fetchesResults/getPlaylist.js";
import { myTopTracks } from "./fetchesResults/myTracks.js";
import { albumTracks } from "./fetchesResults/albumTracks.js";
import { album } from "./fetchesResults/getAlbum.js";
import { artistsAlbums } from "./fetchesResults/getArtistAlbums.js";
import { artist } from "./fetchesResults/getArtist.js";

import { fetchWebApi } from "./request.js";
import { makeFullPlaylist } from "./makePlaylist.js";
import { makeFullUserTopTracks } from "./myTopTracks.js";
import { makeFullAlbum } from "./makeAlbum.js";
import { makeFullArtistAlbumsList } from "./makeArtistAlbumsList.js";
import { makeUserList } from "./userLists.js";

// async function topTracksCurrentUser() {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/me/top/tracks?limit=50`, 'GET'
//   ));
// }


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


// let myTopTracks = await topTracksCurrentUser();
// let playlist = await getPlaylist("2iZTFETkt7Qr6tbETaJDh4");
// let album = await getAlbum("6tG8sCK4htJOLjlWwb7gZB");
// let albumTracks = await getAlbumList("6tG8sCK4htJOLjlWwb7gZB");
// let artist = await getArtist("74XFHRwlV6OrjEM0A2NCMF");
// let artistsAlbums = await getArtistAlbums("74XFHRwlV6OrjEM0A2NCMF");

makeUserList();


// makeFullPlaylist(playlist);
// makeFullAlbum(albumTracks, album);

makeFullArtistAlbumsList(artistsAlbums, artist);



document.getElementById('logo').addEventListener('click', () => {
  makeFullUserTopTracks(myTopTracks);
})

document.getElementById('central_side').addEventListener('click', () => {
  makeFullAlbum(albumTracks, album);
})