export { makeUserList };
import { parseArtists } from "./helper.js";
import { fetchWebApi } from "./request.js";

import { myPlaylists } from "./fetchesResults/myPlaylists.js";
import { myAlbums } from "./fetchesResults/myAlbums.js";
import { myArtists } from "./fetchesResults/myArtists.js";

// async function getUserPlaylists() {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/me/playlists?limit=50`, 'GET'
//   ));
// }

// async function getUserAlbums() {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/me/albums?limit=50&market=UA`, 'GET'
//   ));
// }

// async function getUserArtists() {
//   return (await fetchWebApi(
//     `https://api.spotify.com/v1/me/top/artists?limit=50`, 'GET'
//   ));
// }

// let myPlaylists = await getUserPlaylists();
// let myAlbums = await getUserAlbums();
// let myArtists = await getUserArtists();

function userPlaylistsItem(listItem) {
  let divItem = document.createElement('div');
  divItem.classList.add('my_pl_item', 'list_item', 'playlist', `${listItem.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `
            <div class="icon">
              <img src="${listItem.images[0].url}" alt="image">
              <div class="play_btn">
                <div>
                  <svg width="24" height="24">
                    <use href="./images/icons.svg#play_pl"></use>
                  </svg>
                </div>
              </div>
            </div>
            <div class="data_pl">
              <p class="name_pl">${listItem.name}</p>
              <p class="type_list_item_pl">Плейліст &middot <span class="author_name">${listItem.owner.display_name}</span></p>
            </div>
  `;
  document.getElementById('my_playlists').append(divItem);
}

function userPlaylists(userPlaylists) {
  userPlaylists.items.forEach((element) => {
    userPlaylistsItem(element);
  });
}

function userAlbumsItem(listItem) {
  let divItem = document.createElement('div');
  divItem.classList.add('my_pl_item', 'list_item', 'playlist', `${listItem.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `
            <div class="icon">
              <img src="${listItem.images[0].url}" alt="image">
              <div class="play_btn">
                <div>
                  <svg width="24" height="24">
                    <use href="./images/icons.svg#play_pl"></use>
                  </svg>
                </div>
              </div>
            </div>
            <div class="data_pl">
              <p class="name_pl">${listItem.name}</p>
              <p class="type_list_item_pl">Альбом &middot <span class="author_name">${parseArtists(listItem.artists)}</span></p>
            </div>
  `;
  document.getElementById('my_playlists').append(divItem);
}

function userAlbums(albums) {
  albums.items.forEach((element) => {
    userAlbumsItem(element.album);
  });
}

function userArtistsItem(listItem) {
  let divItem = document.createElement('div');
  divItem.classList.add('my_pl_item', 'list_item', 'artists', `${listItem.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `
            <div class="icon">
              <img src="${listItem.images[0].url}" alt="image">
              <div class="play_btn">
                <div>
                  <svg width="24" height="24">
                    <use href="./images/icons.svg#play_pl"></use>
                  </svg>
                </div>
              </div>
            </div>
            <div class="data_artist">
              <p class="name_artist">${listItem.name}</p>
              <p class="type_list_item_artist">Виконавець</span></p>
            </div>
  `;
  document.getElementById('my_playlists').append(divItem);
}

function userArtists(artists) {
  artists.items.forEach((element) => {
    userArtistsItem(element);
  });
};


function makeUserList() {
  userPlaylists(myPlaylists);
  userAlbums(myAlbums);
  userArtists(myArtists);
}