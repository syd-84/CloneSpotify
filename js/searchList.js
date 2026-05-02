import { fetchWebApi } from "./request.js";
import { makeTracksList } from "./makeTracksList.js";
import { makeArtistList } from "./makeArtistAlbumsList.js";
export { searchFullList };

// -------------------------------------------------

function addArtistItem(listItem, index, listIndex = 0) {
  let divItem = document.createElement('div');
  divItem.classList.add('list_item', 'artists', `${listItem.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `
                <div class="list_number">${index + 1}</div>
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
                <div class="list_data">
                  <div>
                    <div class="list_name">${listItem.name}</div>
                  </div>
                </div>
  `;
  document.getElementsByClassName('list')[listIndex].append(divItem);
}

function makeArtistsList(artists, listIndex = 0) {
  document.getElementsByClassName('list')[listIndex].innerHTML = `
              <div class="head_tracks">
                <div class="list_number">#</div>
                <div class="icon_fantom"></div>
                <div class="head_name">Виконавець</div>
              </div>
              <hr>
  `
  artists.items.forEach((element, index) => {
    addArtistItem(element, index, listIndex);
  });
};

//------------------------------------------------

function addPlaylistItem(listItem, index, listIndex = 0) {
  let divItem = document.createElement('div');
  divItem.classList.add('list_item', 'artists', `${listItem.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `
                <div class="list_number">${index + 1}</div>
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
                <div class="list_data">
                  <div>
                    <div class="list_name">${listItem.name}</div>
                  </div>
                  <div class="list_central">${listItem.owner.display_name}</div>
                  <div class="list_last">${listItem.items.total}</div>
                </div>
  `;
  document.getElementsByClassName('list')[listIndex].append(divItem);
}

function makePlaylistList(playlist, listIndex = 0) {
  document.getElementsByClassName('list')[listIndex].innerHTML = `
              <div class="head_tracks">
                <div class="list_number">#</div>
                <div class="icon_fantom"></div>
                <div class="head_name">Назва плейліста</div>
                <div class="central_col">Автор</div>
                <div class="last_col">К-ть пісень</div>
              </div>
              <hr>
  `
  playlist.forEach((element, index) => {
    addPlaylistItem(element, index, listIndex);
  });
};

//-------------------------------------------------

async function searchFullList(searchResult) {
  document.getElementById('start_section').innerHTML = `
          <h3>Результати пошуку</h3>
          <div id="finded_tracks">
            <h3>Пісні</h3>
            <div class="list"></div>
          </div>
          <h3>Виконавці</h3>
          <div id="finded_artists">
            <div class="list"></div>
          </div>
          <h3>Альбоми</h3>
          <div id="finded_albums">
            <div class="list"></div>
          </div>
          <h3>Плейлісти</h3>
          <div id="finded_playlists">
            <div class="list"></div>
          </div>
  `;
  await makeTracksList(searchResult.tracks);
  await makeArtistsList(searchResult.artists, 1);
  await makeArtistList(searchResult.albums, 2);
  await makePlaylistList(searchResult.playlists.items.filter(el => el !== null), 3);
  central_side.scrollTo({ top: 0 });
}