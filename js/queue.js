export { makeQueue }
import { fetchWebApi } from "./request.js";
import { listLengthObserver } from "./Observer.js";

let listLength;
listLengthObserver.subscribe((list_length) => {
  listLength = list_length;
});

async function getQueue() {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/me/player/queue`, 'GET'
  ));
}


async function makeQueue() {
  let queue = await getQueue();
  let queue_list = document.createElement('div');
  queue_list.id = "queue_list";
  if (queue.currently_playing !== null) {
    queue_list.innerHTML = `
      <h3>Відтворюється:</h3>
      <div class='queue_item'>
        <div class="icon">
          <img src="${queue.currently_playing.album.images[0].url}" alt="">
        </div>
        <div class="list_data">
          <p>${queue.currently_playing.name}</p>
        </div>
      </div>
    `;
    if (listLength > 1) {
      let hr = document.createElement('hr');
      let h3 = document.createElement('h3');
      h3.textContent = 'Далі:';
      queue_list.append(hr);
      queue_list.append(h3);

      let length = Math.min(listLength, queue.queue.length);
      for (let i = 0; i < length - 1; i++) {
        let queue_item = document.createElement('div');
        queue_item.classList.add('queue_item');
        queue_item.innerHTML = `
          <div class="icon">
            <img src="${queue.queue[i].album.images[0].url}" alt="">
          </div>
          <div class="list_data">
            <p>${queue.queue[i].name}</p>
          </div>
        `;
        queue_list.append(queue_item);
      }
    }

    document.body.append(queue_list);


    let overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.append(overlay);
  }
  queue_list.scrollTo({ top: 0 });
}