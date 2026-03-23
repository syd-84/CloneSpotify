import { token } from "./key.js";
export { fetchWebApi };

async function fetchWebApi(requestAPI, method, body) {
  const res = await fetch(requestAPI, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method,
    body: JSON.stringify(body)
  });
  return await res.json();
}