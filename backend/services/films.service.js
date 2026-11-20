const supabase = require('../config/supabase');
const fs = require('fs');
const path = require('path');

const ALLOWED_GENRES = ['SF', 'Drame', 'Comédie', 'Thriller', 'Animation'];
const ALLOWED_STATUSES = ['aVoir', 'vu'];

function apiError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function getAllFilms(query = {}) {
  let request = supabase.from('films').select('*');

  if (query.genre) {
    request = request.eq('genre', query.genre);
  }

  if (query.status) {
    request = request.eq('status', query.status);
  }

  if (query.search) {
    request = request.ilike('title', `%${query.search}%`);
  }

  if (query.sort === 'title') {
    request = request.order('title', { ascending: true });
  } else if (query.sort === 'year') {
    request = request.order('year', { ascending: false });
  } else if (query.sort === 'rating') {
    request = request.order('rating', { ascending: false });
  }

  const { data, error } = await request;

  if (error) {
    throw apiError(500, error.message);
  }

  return data;
}

async function getFilmById(id) {
  const filmId = parseId(id);
  const { data, error } = await supabase.from('films').select('*').eq('id', filmId).maybeSingle();

  if (error) {
    throw apiError(500, error.message);
  }

  if (!data) {
    throw apiError(404, 'Film introuvable');
  }

  return data;
}

async function createFilm(body, file) {
  validateCreateFilm(body);

  const film = {
    title: body.title.trim(),
    genre: body.genre,
    year: Number(body.year),
    image: file ? `images/${file.filename}` : '',
    status: 'aVoir',
    rating: 0,
  };

  const { data, error } = await supabase.from('films').insert(film).select('*').single();

  if (error) {
    if (file) {
      const uploadedFile = path.join(__dirname, '..', 'images', file.filename);
      if (fs.existsSync(uploadedFile)) {
        fs.unlinkSync(uploadedFile);
      }
    }
    throw apiError(400, error.message);
  }

  return data;
}

async function updateFilm(id, body) {
  const filmId = parseId(id);
  body = body || {};

  const updates = {};

  if (body.title !== undefined) {
    if (typeof body.title !== 'string' || body.title.trim() === '') {
      throw apiError(400, 'Le titre est obligatoire');
    }
    updates.title = body.title.trim();
  }

  if (body.genre !== undefined) {
    if (!ALLOWED_GENRES.includes(body.genre)) {
      throw apiError(400, 'Genre invalide');
    }
    updates.genre = body.genre;
  }

  if (body.year !== undefined) {
    const year = Number(body.year);
    if (!Number.isInteger(year) || year < 1888 || year > 2100) {
      throw apiError(400, 'L annee doit etre un entier plausible');
    }
    updates.year = year;
  }

  if (body.status !== undefined) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      throw apiError(400, 'Statut invalide');
    }
    updates.status = body.status;
  }

  if (body.rating !== undefined) {
    if (!Number.isInteger(body.rating) || body.rating < 0 || body.rating > 5) {
      throw apiError(400, 'La note doit etre un entier compris entre 0 et 5');
    }
    updates.rating = body.rating;
  }

  if (Object.keys(updates).length === 0) {
    throw apiError(400, 'Aucune modification fournie');
  }

  const { data, error } = await supabase
    .from('films')
    .update(updates)
    .eq('id', filmId)
    .select('*')
    .maybeSingle();

  if (error) {
    throw apiError(400, error.message);
  }

  if (!data) {
    throw apiError(404, 'Film introuvable');
  }

  return data;
}

async function deleteFilm(id) {
  const filmId = parseId(id);
  const { data: existingFilm } = await supabase
    .from('films')
    .select('image')
    .eq('id', filmId)
    .maybeSingle();

  const { data, error } = await supabase.from('films').delete().eq('id', filmId).select('id');

  if (error) {
    throw apiError(500, error.message);
  }

  if (!data || data.length === 0) {
    throw apiError(404, 'Film introuvable');
  }

  if (existingFilm && existingFilm.image && existingFilm.image.startsWith('images/')) {
    const uploadedFile = path.join(__dirname, '..', existingFilm.image);

    if (fs.existsSync(uploadedFile)) {
      fs.unlinkSync(uploadedFile);
    }
  }
}

function parseId(id) {
  const filmId = Number(id);

  if (!Number.isInteger(filmId) || filmId <= 0) {
    throw apiError(404, 'Film introuvable');
  }

  return filmId;
}

function validateCreateFilm(body) {
  if (!body || typeof body.title !== 'string' || body.title.trim() === '') {
    throw apiError(400, 'Le titre est obligatoire');
  }

  if (!ALLOWED_GENRES.includes(body.genre)) {
    throw apiError(400, 'Genre invalide');
  }

  const year = Number(body.year);

  if (!Number.isInteger(year) || year < 1888 || year > 2100) {
    throw apiError(400, 'L annee doit etre un entier plausible');
  }

  if (body.image !== undefined && typeof body.image !== 'string') {
    throw apiError(400, 'L image doit etre une chaine de caracteres');
  }
}

module.exports = {
  getAllFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm,
};
