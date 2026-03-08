import { token } from "./key.js";

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body)
  });
  return await res.json();
}

// async function getMyId() {
//   return (await fetchWebApi(
//     `v1/me/`, 'GET'
//   ));
// }
// let myId = await getMyId();
// myId = myId.id;


async function getTopTracks() {
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET'
  ));
}
// const topTracks = await getTopTracks();

async function getDevices() {
  return (await fetchWebApi(
    'v1/me/player/devices', 'GET'
  ));
}
const devices = await getDevices();
console.log(devices)

async function getPause(device) {
  return (await fetchWebApi(
    `v1/me/player/pause?device_id=${device}`, 'PUT'
  ));
}

async function getPlay(device) {
  return (await fetchWebApi(
    `v1/me/player/play?device_id=${device}`, 'PUT'
  ));
}

document.body.addEventListener("click", () => {
  getPause("88f2e392567f4a77987dbf1aacf4bc94ca5cddd0")
})

// document.body.addEventListener("click", () => {
//   getPlay("88f2e392567f4a77987dbf1aacf4bc94ca5cddd0")
// })

async function getMyLists() {
  return (await fetchWebApi(
    `v1/me`, 'GET'
  ));
}
// let myLists = await getMyLists();

// console.log(myLists);



// devices.devices.forEach((element, index) => {
//   let divDev = document.createElement("div");
//   divDev.id = `dev_${element.id}`;
//   divDev.classList.add("device");
//   divDev.textContent = `${index + 1}. device of: ${element.name}, ${element.type}`
//   document.getElementById("devices").append(divDev);
// });


// let deviceId;
// document.getElementById("devices").addEventListener("click", (e) => {
//   if (e.target.classList.contains("device")) {
//     deviceId = e.target.id.slice(4);
//     document.getElementById("devices").remove();
//   }
// })

