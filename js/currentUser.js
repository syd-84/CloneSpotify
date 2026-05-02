import { fetchWebApi } from "./request.js";
export { currentUser };

// import { me } from "./fetchesResults/me.js";

async function getUserData() {
  return (await fetchWebApi(
    `https://api.spotify.com/v1/me`, 'GET'
  ));
}
let me = await getUserData();

function currentUser() {
  document.querySelector('#userData>div>p').textContent = `${me.display_name}`
}