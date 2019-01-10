const TOKEN = undefined; // TODO: get token securely
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};
const json = res => res.json();

export function getFarmbot(path) {
  return fetch(`https://my.farmbot.io/api${path}`, {
    headers,
  }).then(json);
}

export function get(path) {
  return fetch(`http://localhost:3000${path}`, {
    headers: { 'Content-Type': 'application/json' },
  }).then(json);
}

export function post(path, body) {
  return fetch(`http://localhost:3000${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(json);
}
