import { playlist } from "../../Paramore/getPlaylist.js"
import { msToTimeFormat } from "./layout.js"

// playlist = fetch for playlistUri
let playlistItemsArr = playlist.items.items;

// console.dir(playlistItemsArr[0])
// console.dir(playlist)

function getArtists(index) {
  let res = '';
  playlistItemsArr[index].item.artists.forEach(element => {
    res += element.name + ', ';
  });
  return res.slice(0, -2)
}

function makeListItem(trackUri, index) {
  let divItem = document.createElement('div');
  divItem.classList.add('list_item', `${trackUri}`);
  divItem.innerHTML = `<div class="list_number">${index + 1}</div>
                <div class="icon">
                  <img src="${playlistItemsArr[index].item.album.images[0].url}" alt="image">
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
                    <div class="list_name">${playlistItemsArr[index].item.name}</div>
                    <div class="list_artist">${getArtists(index)}</div>
                  </div>
                  <div class="list_central">${playlistItemsArr[index].item.album.name}</div>
                  <div class="list_last">${msToTimeFormat(playlistItemsArr[index].item.duration_ms)}</div>
                </div>`;
  document.getElementsByClassName('list')[0].append(divItem);
}

function makeFullPlaylist(playlistUri) {
  document.getElementById('start_section').innerHTML = `<div id="playlist_envelope">
            <div>
              <img src="${playlist.images[0].url}" alt="">
            </div>
            <div>
              <p>Плейліст</p>
              <h2>${playlist.name}</h2>
            </div>
          </div>
          
          <div id="playlist_tracks" class="${playlistUri.replaceAll(':', '_')}">
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
  playlistItemsArr.forEach((element, index) => {
    makeListItem(element.item.uri, index)
  })
}

makeFullPlaylist("spotify:playlist:4dhl1GQkOHCdi3VBPoxSys");
