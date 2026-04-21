const CLIENT_ID = "CLIENT_ID";
const CLIENT_SECRET = "CLIENT_SECRET";

let token = "";

async function getToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(CLIENT_ID + ":" + CLIENT_SECRET),
    },
    body: "grant_type=client_credentials",
  });

  const data = await res.json();
  token = data.access_token;
}

async function searchSpotify(query) {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=5`,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );

  const data = await res.json();

  return {
    tracks: data.tracks.items.map((track) => ({
      name: track.name,
      artist: track.artists[0].name,
      image: track.album.images[0]?.url,
    })),

    artists: data.artists.items.map((artist) => ({
      name: artist.name,
      image: artist.images[0]?.url,
    })),

    albums: data.albums.items.map((album) => ({
      name: album.name,
      artist: album.artists[0].name,
      image: album.images[0]?.url,
    })),
  };
}

function debounce(fn, delay) {
  let timeout;

  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

const input = document.getElementById("search");
const results = document.getElementById("results");

const handleSearch = debounce(async () => {
  const query = input.value;

  if (query.length < 2) {
    results.innerHTML = "";
    return;
  }

  const data = await searchSpotify(query);

  results.innerHTML = "";

  data.tracks.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${item.image}" width="50"/>
      <p>🎵 ${item.name} - ${item.artist}</p>
    `;
    results.appendChild(div);
  });

  data.artists.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${item.image || ""}" width="50"/>
      <p>🎤 ${item.name}</p>
    `;
    results.appendChild(div);
  });

  data.albums.forEach((item) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${item.image}" width="50"/>
      <p> ${item.name} - ${item.artist}</p>
    `;
    results.appendChild(div);
  });
}, 400);

input.addEventListener("input", handleSearch);

getToken();
