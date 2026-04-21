export { makeFullArtistAlbumsList, makeArtistList };

function makeListItem(artistsAlbumsItem, index, listIndex = 0) {
  let divItem = document.createElement('div');
  divItem.classList.add('list_item', `${artistsAlbumsItem.uri.replaceAll(':', '_')}`);
  divItem.innerHTML = `
                <div class="list_number">${index + 1}</div>
                <div class="icon">
                  <img src="${artistsAlbumsItem.images[0].url}">
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
                    <div class="list_name">${artistsAlbumsItem.name}</div>
                  </div>
                  <div class="list_last">${artistsAlbumsItem.total_tracks}</div>
                </div>
  `;
  document.getElementsByClassName('list')[listIndex].append(divItem);
}

function makeArtistList(artistsAlbums, listIndex = 0) {
  document.getElementsByClassName('list')[listIndex].innerHTML = `
              <div class="head_tracks">
                <div class="list_number">#</div>
                <div class="icon_fantom"></div>
                <div class="central_col">Альбом</div>
                <div class="last_col">
                  Пісень
                </div>
              </div>
              <hr>
  `;
  artistsAlbums.items.forEach((element, index) => {
    makeListItem(element, index, listIndex)
  });
}

function makeFullArtistAlbumsList(artistsAlbums, artist, listIndex = 0) {
  document.getElementById('start_section').innerHTML = `
          <div id="artist_envelope">
            <img src="${artist.images[0].url}" alt="">
            <h2>${artist.name}</h2>
          </div>

          <div id="artist_tracks" class="${artist.uri.replaceAll(':', '_')}">
            <div class="list"></div>
          </div>
  `;
  makeArtistList(artistsAlbums)
}