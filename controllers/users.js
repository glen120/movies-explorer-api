const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const code = require('../utils/codes');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserInfo = (req, res, next) => User.findById(req.user._id)
  .then((user) => {
    if (user) {
      res.status(code.ok).send(user);
    } else {
      next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Ошибочный поисковый запрос'));
    }
    return next(err);
  });

const updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (user) {
        res.status(code.ok).send(user);
      } else {
        next(new NotFoundError('Запрашиваемый пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
      } if (err.name === 'ValidationError') {
        return next(new BadRequestError('Произошла ошибка при обновлении профиля'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(code.created).send({
        name, email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError('Пользователь с такой почтой уже зарегистрирован'));
      } if (err.name === 'ValidationError') {
        return next(new BadRequestError('Произошла ошибка при создании пользователя'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.status(code.ok).send({ token });
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  updateUserInfo,
  createUser,
  login,
};
