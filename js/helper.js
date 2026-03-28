export { parseURI }

function parseURI(uri) {
  if (uri.includes("spotify")) {
    return uri.match(/(?<=spotify\_)\w+/)[0].split("_");
  }
}