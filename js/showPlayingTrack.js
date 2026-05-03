export { showPlayingTrack };

import { parseArtists } from "./helper.js";
import { getArtist } from "./makeArtistAlbumsList.js";

let artistImage = '';
let artist;

async function showPlayingTrack(currentTrack) {
  if (currentTrack.artists.length === 1) {
    artist = await getArtist(currentTrack.artists[0].uri.split(':')[2]);
    if (artist.images.length !== 0) artistImage = artist.images[0].url
    else artistImage = '';
  } else artistImage = '';

  document.getElementById('plaing_track').innerHTML = `
        <div class="track_icon">
          <img src="${currentTrack.album.images[0].url}" alt="image">
        </div>
        <div class="list_data">
          <p>${currentTrack.name}</p>
          <p>${parseArtists(currentTrack.artists)}</p>
        </div>
  `;
  document.getElementById('right_side').innerHTML = `
        <div id="list_name">${currentTrack.name}</div>
        <img id="track_img" src="${currentTrack.album.images[0].url}" alt="">
        <div id="artist">
          <div id="artist_name">${parseArtists(currentTrack.artists)}</div>
          <img id="artist_img" src="${artistImage}" alt="">
  `;
}