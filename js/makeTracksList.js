import { parseArtists, msToTimeFormat } from "./helper.js";
import { fetchWebApi } from "./request.js";
import { updatePlayBtns } from "./player.js";
export { makeFullTracksList, makeTracksList }

async function topTracksCurrentUser() {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/me/top/tracks?limit=50`, 'GET'
  ));
}

let myTopTracks = await topTracksCurrentUser();


function makeListItem(listItem, index, listIndex = 0) {
  let divItem = document.createElement('div');
  divItem.classList.add('list_item', `${listItem.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `<div class="list_number">${index + 1}</div>
                <div class="icon">
                  <img src="${listItem.album.images[0].url}" alt="image">
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
                    <div class="list_artist">${parseArtists(listItem.artists)}</div>
                  </div>
                  <div class="list_central"><span class="point ${listItem.album.uri.replaceAll(':', '_')}">${listItem.album.name}</span></div>
                  <div class="list_last">${msToTimeFormat(listItem.duration_ms)}</div>
                </div>`
  document.getElementsByClassName('list')[listIndex].append(divItem);
}

function makeTracksList(topTracks, listIndex = 0) {
  document.getElementsByClassName('list')[listIndex].innerHTML = `
              <div class="head_tracks">
                <div class="list_number">#</div>
                <div class="icon_fantom"></div>
                <div class="head_name">Назва пісні</div>
                <div class="central_col">Альбом</div>
                <div class="last_col">
                  <svg width="24" height="24">
                    <use href="./images/icons.svg#duration"></use>
                  </svg>
                </div>
              </div>
              <hr>
  `;
  topTracks.items.forEach((element, index) => {
    makeListItem(element, index, listIndex)
  });
}

async function makeFullTracksList() {
  document.getElementById('start_section').innerHTML = `
        <h3>Топ моїх пісень:</h3>
          <div id="my_top_tracks">
            <div class="list">
            </div>
          </div>`
  await makeTracksList(myTopTracks);
  central_side.scrollTo({ top: 0 });
}