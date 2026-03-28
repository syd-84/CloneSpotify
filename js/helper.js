export { parseURI }

function parseURI(uri) {
  if (uri.includes("spotify")) {
    return uri.match(/spotify\:[\w+\:]+/)[0].split(":");
  }
}