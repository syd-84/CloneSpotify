"use strict"

document.querySelector("#search input").value = "";

document.querySelector("#search input").addEventListener("input", (e) => {
  const close_icon = document.getElementById("close_icon");
  if (e.target.value === "") {
    close_icon.classList.remove("visible_icon");
    close_icon.classList.add("hidden_icon");
  }
  else {
    close_icon.classList.remove("hidden_icon");
    close_icon.classList.add("visible_icon");
  }
})

document.getElementById("close_icon").addEventListener("click", () => {
  document.querySelector("#search input").value = "";
  close_icon.classList.remove("visible_icon");
  close_icon.classList.add("hidden_icon");
  document.querySelector("#search input").focus()
})


// ------------------player range-------------------

const range = document.getElementById("range");
let duration_ms = 198292;
range.min = 0;
range.max = Math.round(duration_ms / 1000) * 1000;
range.value = 80;

function msToTimeFormat(duration_ms) {
  let duration_s = Math.round(duration_ms / 1000);
  let minutes = Math.floor(duration_s / 60);
  let seconds = duration_s % 60;
  return `${minutes}:${seconds.toFixed(0).padStart(2, "0")}`;
}

function updateRange() {
  let value = range.value;

  const percent = ((value) / (range.max)) * 100;
  // range.style.background = `linear-gradient(to right, #1db954 ${percent}%, #535353 ${percent}%)`;
  range.style.background = `linear-gradient(to right, #fff ${percent}%, #535353 ${percent}%)`;
  document.getElementById("track_time_current").textContent = msToTimeFormat(range.value);
}

range.addEventListener("input", updateRange);
updateRange();


const guide = document.getElementById("guide");

range.addEventListener("mousemove", (e) => {
  let guideValue = (e.offsetX - 6) / (e.target.offsetWidth - 12) * duration_ms;

  guide.classList.remove("hidden");
  guide.classList.add("visible");

  let posTop = e.target.offsetTop - guide.clientHeight - 5;
  let posLeft = e.target.offsetLeft + e.offsetX - guide.offsetWidth / 2;

  if (e.offsetX <= 6) {
    posLeft = e.target.offsetLeft - 6;
    guideValue = 0;
  }
  if (e.offsetX >= e.target.offsetWidth - 6) {
    posLeft = e.target.offsetLeft + e.target.offsetWidth - guide.offsetWidth / 2 - 6;
    guideValue = duration_ms;
  }

  guide.style.top = posTop + "px";
  guide.style.left = posLeft + "px";
  guide.textContent = msToTimeFormat(guideValue);
})

range.addEventListener("mouseleave", (e) => {
  guide.classList.remove("visible");
  guide.classList.add("hidden");
})

document.getElementById("track_timefull").textContent = msToTimeFormat(duration_ms);



// ---------------volume-----------------

const volume = document.getElementById("volume");
volume.min = 0;
volume.max = 100;

localStorage.getItem("spotifyCloneVol") ? volume.value = localStorage.getItem("spotifyCloneVol") : volume.value = 50;

function changeVolSvg(param) {
  document.getElementById("volume_svg").innerHTML = `<use href="./images/icons.svg#volume_${param}"></use>`;
}

function updateVolume() {
  let value = volume.value;

  const percent = ((value) / (volume.max)) * 100;
  volume.style.background = `linear-gradient(to right, #fff ${percent}%, #535353 ${percent}%)`;
  if (volume.value == 0) changeVolSvg("0")
  else if (volume.value > 0 && volume.value <= 33) changeVolSvg("0_33")
  else if (volume.value > 33 && volume.value <= 67) changeVolSvg("33_67")
  else changeVolSvg("67_100");

  localStorage.setItem("spotifyCloneVol", volume.value);
}

volume.addEventListener("input", updateVolume);
updateVolume();

let prevVol;
document.getElementById("volume_svg").addEventListener("click", (e) => {
  if (volume.value == 0) {
    if (!volume.classList.contains("muted")) prevVol = 1;
    volume.value = prevVol;
    volume.classList.remove("muted");
  } else {
    prevVol = volume.value;
    volume.value = 0;
    volume.classList.add("muted");
  }
  updateVolume();
  localStorage.setItem("spotifyCloneVol", volume.value);
})