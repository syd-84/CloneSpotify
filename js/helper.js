export { parseURI, getURIClass }

function parseURI(uri) {
  if (uri.includes("spotify")) {
    return uri.match(/spotify\_\w+/)[0].split("_");
  }
}

function getURIClass(uri) {
  return uri.match(/spotify\_\w+/)[0];
}