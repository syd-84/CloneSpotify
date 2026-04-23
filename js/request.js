import { CLIENT_ID, CLIENT_SECRET } from "./key.js";
export { fetchWebApi };

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
  return token;
}

token = await getToken();

async function fetchWebApi(requestAPI, method, body) {
  const res = await fetch(requestAPI, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: JSON.stringify(body)
  });
  return await res.json();
}