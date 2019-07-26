const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJ1bmtub3duIiwic3ViIjozNzQ3LCJpYXQiOjE1NjQxNTkwMTMsImp0aSI6IjEwMzNhMGY5LWJkYzYtNGFlNS1iOGVhLTA4ZmViODk0NjdmYSIsImlzcyI6Ii8vbXkuZmFybS5ib3Q6NDQzIiwiZXhwIjoxNTY3NjE1MDEzLCJtcXR0IjoiY2xldmVyLW9jdG9wdXMucm1xLmNsb3VkYW1xcC5jb20iLCJib3QiOiJkZXZpY2VfMzc0MiIsInZob3N0IjoieGljb25mdW0iLCJtcXR0X3dzIjoid3NzOi8vY2xldmVyLW9jdG9wdXMucm1xLmNsb3VkYW1xcC5jb206NDQzL3dzL21xdHQiLCJvc191cGRhdGVfc2VydmVyIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9mYXJtYm90L2Zhcm1ib3Rfb3MvcmVsZWFzZXMvbGF0ZXN0IiwiYmV0YV9vc191cGRhdGVfc2VydmVyIjoiaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy9GYXJtQm90L2Zhcm1ib3Rfb3MvcmVsZWFzZXMvMTQ1ODE4NzEifQ.rDAxl3WiVRpYOnAGUFW9Q5aunBDo-qQ9iu2jDV0W-OJt-yPGzLfzno8liyCO1_1ohZuL7vHTs1kzAivOX4c2FICxKcNnbAtCcyxYLC44vNg9fnQNQQS1JnOprisE8lpMg1hU26VqrOL-aN3gMngO_2xV41Tq0rpdhCNywPKSXspuTlp_A1dHmd16C9wAX7MjxzRZnU6B2asT_H0vl9jV-5wt2UiCq7udK3gjJBkWEVOoIkfvgYCfIj2eeBKMpaAeF11x21TTh5bQB2beBLoiH5OAaaM2JCLHlhxSJ-XkeDXijIneDvfddbila-gok8T9A_6P8aU-aiFmmNe5GlTUcQ'; // TODO: get token securely
const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${TOKEN}`,
};
const json = async res => {
  const body = await res.json();
  if (res.ok) {
    return body;
  } else {
    throw new Error(JSON.stringify(body));
  }
};

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
