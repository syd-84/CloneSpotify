export { parseURI, getURIClass, msToTimeFormat, getArtists }

function parseURI(uri) {
  if (uri.includes("spotify")) {
    return uri.match(/spotify\_\w+/)[0].split("_");
  }
}

function getURIClass(uri) {
  return uri.match(/spotify\_\w+/)[0];
}

function msToTimeFormat(duration_ms) {
  let duration_s = Math.round(duration_ms / 1000);
  let minutes = Math.floor(duration_s / 60);
  let seconds = duration_s % 60;
  return `${minutes}:${seconds.toFixed(0).padStart(2, "0")}`;
}

function getArtists(artists) {
  let res = '';
  artists.forEach(element => {
    res += element.name + ', ';
  });
  return res.slice(0, -2)
}