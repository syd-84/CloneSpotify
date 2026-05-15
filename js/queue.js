export { makeQueue }
import { fetchWebApi } from "./request.js";

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
      <hr>
      <h3>Далі:</h3>
    `;

    queue.queue.forEach(el => {
      let queue_item = document.createElement('div');
      queue_item.classList.add('queue_item');
      queue_item.innerHTML = `
        <div class="icon">
          <img src="${el.album.images[0].url}" alt="">
        </div>
        <div class="list_data">
          <p>${el.name}</p>
        </div>
      `;
      queue_list.append(queue_item);
    });
    console.dir(queue.currently_playing)
    document.body.append(queue_list);


    let overlay = document.createElement('div');
    overlay.id = 'overlay';
    document.body.append(overlay);
  }
  queue_list.scrollTo({ top: 0 });
  console.log(queue);
}