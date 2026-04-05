import { playlist } from "./fetchesResults/getPlaylist.js";
import { makeFullPlaylist } from "./makePlaylist.js";
import { fetchWebApi } from "./request.js"

// async function getPlaylist(id) {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/playlists/${id}`, 'GET'
//   ));
// }
// let playlist = await getPlaylist("4dhl1GQkOHCdi3VBPoxSys");

makeFullPlaylist(playlist);

console.log(playlist);