// import { playlist } from "./fetchesResults/getPlaylist.js";


import { msToTimeFormat, parseArtists } from "./helper.js";
import { fetchWebApi } from "./request.js";
export { makeFullPlaylist, getPlaylist };

function getArtists(artists) {
  let res = '';
  artists.forEach(element => {
    res += element.name + ', ';
  });
  return res.slice(0, -2)
}

async function getPlaylist(id) {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/playlists/${id}`, 'GET'
  ));
}

function makeListItem(playlistItem, index) {
  let divItem = document.createElement('div');
  divItem.classList.add('list_item', `${playlistItem.item.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `<div class="list_number">${index + 1}</div>
                <div class="icon">
                  <img src="${playlistItem.item.album.images[0].url}" alt="image">
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
                    <div class="list_name">${playlistItem.item.name}</div>
                    <div class="list_artist">${parseArtists(playlistItem.item.artists)}</div>
                  </div>
                  <div class="list_central"><span class="point ${playlistItem.item.album.uri.replaceAll(':', '_')}">${playlistItem.item.album.name}</span></div>
                  <div class="list_last">${msToTimeFormat(playlistItem.item.duration_ms)}</div>
                </div>`;
  document.getElementsByClassName('list')[0].append(divItem);
}

function makeList(playlist) {
  playlist.items.items.forEach((el, index) => {
    makeListItem(el, index)
  })
}

async function makeFullPlaylist(uri) {
  let playlist = await getPlaylist(uri);

  document.getElementById('start_section').innerHTML = `
          <div id="playlist_envelope">
            <div>
              <img src="${playlist.images[0].url}" alt="">
            </div>
            <div>
              <p>Плейліст</p>
              <h2>${playlist.name}</h2>
            </div>
          </div>
          
          <div id="playlist_tracks" class="${playlist.uri.replaceAll(':', '_')}">
            <div class="list">
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
            </div>
          </div>`;
  await makeList(playlist);
  central_side.scrollTo({ top: 0 });
}
