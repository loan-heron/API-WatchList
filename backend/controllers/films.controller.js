const filmsService = require('../services/films.service');

async function getAllFilms(req, res) {
  try {
    const films = await filmsService.getAllFilms(req.query);
    return res.status(200).json(films);
  } catch (error) {
    return sendError(res, error);
  }
}

async function getFilmById(req, res) {
  try {
    const film = await filmsService.getFilmById(req.params.id);
    return res.status(200).json(film);
  } catch (error) {
    return sendError(res, error);
  }
}

async function createFilm(req, res) {
  try {
    const film = await filmsService.createFilm(req.body, req.file);
    return res.status(201).json(film);
  } catch (error) {
    return sendError(res, error);
  }
}

async function updateFilm(req, res) {
  try {
    const film = await filmsService.updateFilm(req.params.id, req.body);
    return res.status(200).json(film);
  } catch (error) {
    return sendError(res, error);
  }
}

async function deleteFilm(req, res) {
  try {
    await filmsService.deleteFilm(req.params.id);
    return res.status(204).send();
  } catch (error) {
    return sendError(res, error);
  }
}

function sendError(res, error) {
  const status = error.status || 500;

  if (status === 500) {
    console.error(error);
  }

  return res.status(status).json({
    error: error.message || 'Erreur interne du serveur',
  });
}

module.exports = {
  getAllFilms,
  getFilmById,
  createFilm,
  updateFilm,
  deleteFilm,
};