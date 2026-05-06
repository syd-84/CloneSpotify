export { devices }
import { fetchWebApi } from "./request.js";

// import { devicesArr } from "./fetchesResults/devices.js";

async function getDevices() {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/me/player/devices`, 'GET'
  ));
}

async function devices() {
  // let devices = devicesArr;

  let devices = await getDevices();
  let devices_list = document.createElement('div');
  devices_list.id = "devices_list";
  devices_list.innerHTML = '<h3>Запущені пристрої:</h3>';
  volume_panel.append(devices_list);

  devices.devices.forEach(el => {
    let device_item = document.createElement('div');
    device_item.classList.add('device_item', `device_id_${el.id}`);
    if (el.is_active === true) device_item.classList.add('device_active');
    device_item.textContent = `${el.name}`;
    devices_list.append(device_item);
  })

  let overlay = document.createElement('div');
  overlay.id = 'overlay';
  document.body.append(overlay);
}