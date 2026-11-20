const API_URL = 'http://localhost:4001/api/films';
const IMAGE_URL = 'http://localhost:4001/';

async function readResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Erreur du serveur (${response.status})`);
  }

  return data;
}

async function fetchFilms() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(API_URL, {
      signal: controller.signal,
    });
    return await readResponse(response);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Le serveur ne repond pas (delai depasse)');
    }

    throw new Error('Impossible de contacter le serveur API');
  } finally {
    clearTimeout(timeout);
  }
}

async function createFilm(formData) {
  const response = await fetch(API_URL, {
    method: 'POST',
    body: formData,
  });

  return readResponse(response);
}

async function updateFilm(id, changes) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(changes),
  });

  return readResponse(response);
}

async function deleteFilm(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  return readResponse(response);
}
