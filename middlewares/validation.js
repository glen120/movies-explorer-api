const { celebrate, Joi } = require('celebrate');
const validateUrl = require('../utils/validateUrl');

const signupValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
});

const signinValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  }),
});

const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(100),
    director: Joi.string().required().min(2).max(100),
    duration: Joi.number().required().min(1).max(9999),
    year: Joi.string().required().min(4).max(30),
    description: Joi.string().required().min(2).max(300),
    image: Joi.string().required().regex(validateUrl),
    trailerLink: Joi.string().required().regex(validateUrl),
    thumbnail: Joi.string().required().regex(validateUrl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});

module.exports = {
  signupValidator,
  signinValidator,
  updateUserValidator,
  createMovieValidator,
  deleteMovieValidator,
};
