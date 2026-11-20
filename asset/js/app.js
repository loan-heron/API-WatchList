const state = {
  films: [],
  search: '',
  genre: '',
  status: '',
  sort: '',
};

function getVisibleFilms() {
  let result = state.films.filter((film) => {
    const search = state.search.toLowerCase();
    const matchesSearch = film.title.toLowerCase().includes(search);
    const matchesGenre = state.genre === '' || film.genre === state.genre;
    const matchesStatus = state.status === '' || film.status === state.status;

    return matchesSearch && matchesGenre && matchesStatus;
  });

  if (state.sort === 'title') {
    result = [...result].sort((a, b) => a.title.localeCompare(b.title));
  } else if (state.sort === 'year') {
    result = [...result].sort((a, b) => b.year - a.year);
  } else if (state.sort === 'rating') {
    result = [...result].sort((a, b) => b.rating - a.rating);
  }

  return result;
}

function refresh() {
  renderList(getVisibleFilms());
  renderStats(state.films);
}

function showMessage(message) {
  document.getElementById('message').textContent = message;
}

document.getElementById('search').addEventListener('input', (event) => {
  state.search = event.target.value;
  refresh();
});

document.getElementById('filter-genre').addEventListener('change', (event) => {
  state.genre = event.target.value;
  refresh();
});

document.getElementById('filter-status').addEventListener('change', (event) => {
  state.status = event.target.value;
  refresh();
});

document.getElementById('sort').addEventListener('change', (event) => {
  state.sort = event.target.value;
  refresh();
});

document.getElementById('film-list').addEventListener('click', async (event) => {
  const star = event.target.closest('.star');
  const actionButton = event.target.closest('[data-action]');

  if (star) {
    const card = star.closest('.card');
    const id = Number(card.dataset.id);
    const value = Number(star.dataset.value);
    const film = state.films.find((item) => item.id === id);

    if (!film) {
      return;
    }

    const rating = film.rating === value ? 0 : value;

    try {
      await updateFilm(id, { rating });
      film.rating = rating;
      refresh();
    } catch (error) {
      showMessage(error.message);
    }

    return;
  }

  if (!actionButton) {
    return;
  }

  const card = actionButton.closest('.card');
  const id = Number(card.dataset.id);
  const film = state.films.find((item) => item.id === id);

  try {
    if (actionButton.dataset.action === 'toggle-status') {
      const status = film.status === 'vu' ? 'aVoir' : 'vu';
      await updateFilm(id, { status });
      film.status = status;
      refresh();
    }

    if (actionButton.dataset.action === 'edit') {
      openFilmDialog(film);
    }

    if (actionButton.dataset.action === 'delete') {
      if (!window.confirm(`Supprimer « ${film.title} » ?`)) {
        return;
      }

      await deleteFilm(id);
      state.films = state.films.filter((item) => item.id !== id);
      refresh();
    }
  } catch (error) {
    showMessage(error.message);
  }
});

const addDialog = document.getElementById('add-dialog');
const filmForm = document.getElementById('film-form');
const formError = document.getElementById('form-error');

let editingId = null;

function openFilmDialog(film = null) {
  editingId = film ? film.id : null;
  filmForm.reset();
  formError.textContent = '';

  document.getElementById('add-title').textContent = film ? 'Modifier le film' : 'Ajouter un film';
  document.getElementById('submit-film').textContent = film ? 'Enregistrer' : 'Ajouter';
  document.getElementById('image-field').hidden = Boolean(film);

  if (film) {
    document.getElementById('new-title').value = film.title;
    document.getElementById('new-genre').value = film.genre;
    document.getElementById('new-year').value = film.year;
  }

  addDialog.showModal();
  document.getElementById('new-title').focus();
}

function closeAddDialog() {
  addDialog.close();
}

document.getElementById('open-add').addEventListener('click', () => openFilmDialog());
document.getElementById('close-add').addEventListener('click', closeAddDialog);
document.getElementById('cancel-add').addEventListener('click', closeAddDialog);

// Clic sur le fond sombre = fermeture
addDialog.addEventListener('click', (event) => {
  if (event.target === addDialog) {
    closeAddDialog();
  }
});

filmForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.textContent = '';

  const title = document.getElementById('new-title').value.trim();
  const genre = document.getElementById('new-genre').value;
  const year = document.getElementById('new-year').value;

  try {
    if (editingId !== null) {
      const updated = await updateFilm(editingId, { title, genre, year: Number(year) });
      state.films = state.films.map((item) => (item.id === editingId ? updated : item));
      closeAddDialog();
      showMessage(`Film modifié : ${updated.title}`);
      refresh();
      return;
    }

    const formData = new FormData();
    formData.set('title', title);
    formData.set('genre', genre);
    formData.set('year', year);

    const image = document.getElementById('new-image').files[0];

    if (image) {
      formData.set('image', image);
    }

    const film = await createFilm(formData);
    state.films.push(film);
    closeAddDialog();
    showMessage(`Film ajouté : ${film.title}`);
    refresh();
  } catch (error) {
    formError.textContent = error.message;
  }
});

async function loadFilms() {
  showMessage('Chargement des films...');

  try {
    state.films = await fetchFilms();
    showMessage('');
    refresh();
  } catch (error) {
    state.films = [];
    showMessage(error.message);
    refresh();
  }
}

loadFilms();
