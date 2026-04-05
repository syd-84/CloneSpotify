import { playlist } from "./fetchesResults/getPlaylist.js";
import { makeFullPlaylist } from "./makePlaylist.js";
import { fetchWebApi } from "./request.js"

// async function getPlaylist(id) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/playlists/${id}`, 'GET'
//   ));
// }
// let playlist = await getPlaylist("2iZTFETkt7Qr6tbETaJDh4");

// makeFullPlaylist(playlist);

// console.dir(playlist);

// document.body.addEventListener('click', () => {
//   makeFullPlaylist(playlist);
// })