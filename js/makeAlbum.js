export { makeFullAlbum, getAlbum };
import { parseArtists, msToTimeFormat } from "./helper.js";
import { fetchWebApi } from "./request.js";
import { updatePlayBtns } from "./player.js";


async function getAlbum(id) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/albums/${id}`, 'GET'
  ));
}


async function getAlbumList(id) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/albums/${id}/tracks?market=UA&limit=50`, 'GET'
  ));
}

function makeAlbumItem(item, index) {
  let divItem = document.createElement('div');
  divItem.classList.add('list_item', `${item.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `
                <div class="list_number">
                  <div class="artist_play_btn">
                    <svg width="24" height="24">
                      <use href="./images/icons.svg#play_pl"></use>
                    </svg>
                  </div>
                  <p>${index + 1}</p>
                </div>
                <div class="list_data">
                  <div>
                    <div class="list_name">${item.name}</div>
                    <div class="list_artist">${parseArtists(item.artists)}</div>
                  </div>
                  <div class="list_last">${msToTimeFormat(item.duration_ms)}</div>
                </div>
  `;
  document.getElementsByClassName('list')[0].append(divItem);
}

function makeAlbumList(albumList) {
  albumList.items.forEach((element, index) => {
    makeAlbumItem(element, index);
  });
}

async function makeFullAlbum(uri) {
  let album = await getAlbum(uri);
  let albumTracks = await getAlbumList(uri);

  document.getElementById('start_section').innerHTML = `
          <div id="album_envelope">
            <div>
              <img src="${album.images[0].url}" alt="">
            </div>
            <div>
              <p>Альбом</p>
              <h2>${album.name}</h2>
            </div>
          </div>

          <div id="album_tracks" class="${album.uri.replaceAll(':', '_')}">
            <div class="list">
              <div class="head_tracks">
                <div class="list_number">#</div>
                <div class="head_name">Назва пісні</div>
                <div class="last_col">
                  <svg width="24" height="24">
                    <use href="./images/icons.svg#duration"></use>
                  </svg>
                </div>
              </div>
              <hr>

            </div>
          </div>
  `;
  makeAlbumList(albumTracks);
  updatePlayBtns();
}