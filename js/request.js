import { token } from "./key.js";
export { fetchWebApi };

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