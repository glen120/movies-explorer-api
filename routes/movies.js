const movies = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { createMovieValidator, deleteMovieValidator } = require('../middlewares/validation');

movies.get('/movies', getMovies);
movies.post('/movies', createMovieValidator, createMovie);
movies.delete('/movies/:id', deleteMovieValidator, deleteMovie);

module.exports = movies;
