const BASE_URL = 'http://localhost:3000/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');

  const respuesta = await fetch(BASE_URL + path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.message || 'Ocurrió un error al conectar con el servidor.');
  }
  return datos;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
};
