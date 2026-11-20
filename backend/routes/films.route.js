const express = require('express');
const router = express.Router();
const filmsController = require('../controllers/films.controller');
const { uploadImage } = require('../services/images.service');

router.get('/films', filmsController.getAllFilms);
router.get('/films/:id', filmsController.getFilmById);
router.post('/films', uploadImage, filmsController.createFilm);
router.patch('/films/:id', filmsController.updateFilm);
router.delete('/films/:id', filmsController.deleteFilm);

module.exports = router;
