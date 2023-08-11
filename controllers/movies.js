const Movie = require('../models/movie');
const code = require('../utils/codes');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const ConflictError = require('../errors/ConflictError');

const getMovies = (req, res, next) => Movie.find({})
  .then((movies) => res.status(code.ok).send(movies))
  .catch(next);

const createMovie = (req, res, next) => {
  const ownerId = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  return Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: ownerId,
    movieId,
    nameRU,
    nameEN,
  })
    .then((newMovie) => res.status(code.created).send(newMovie))
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Такой фильм уже зарегистрирован'));
      } if (err.name === 'ValidationError') {
        return next(new BadRequestError('Произошла ошибка при создании фильма'));
      }
      return next(err);
    });
};

const deleteMovie = (req, res, next) => Movie.findById(req.params._id)
  .then((movie) => {
    if (!movie) {
      throw new NotFoundError('Запрашиваемый фильм не найден');
    }
    if (movie.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Чужой фильм удалить нельзя');
    }
    return Movie.findByIdAndRemove(req.params._id)
      .then(() => res.status(code.ok).send({ message: 'Фильм удален' }));
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Произошла ошибка при удалении фильма'));
    }
    return next(err);
  });

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
