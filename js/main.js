import { playlist } from "./fetchesResults/getPlaylist.js";
import { myTopTracks } from "./fetchesResults/myTracks.js";

import { fetchWebApi } from "./request.js"
import { makeFullPlaylist } from "./makePlaylist.js";
import { makeFullUserTopTracks } from "./myTopTracks.js";


// async function topTracksCurrentUser() {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/me/top/tracks?limit=50`, 'GET'
//   ));
// }
// let myTopTracks = await topTracksCurrentUser();



// async function getPlaylist(id) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/playlists/${id}`, 'GET'
//   ));
// }
// let playlist = await getPlaylist("2iZTFETkt7Qr6tbETaJDh4");

// makeFullPlaylist(playlist);



makeFullUserTopTracks(myTopTracks);

document.getElementById('logo').addEventListener('click', () => {
  makeFullUserTopTracks(myTopTracks);
})

document.getElementById('central_side').addEventListener('click', () => {
  makeFullPlaylist(playlist);
})