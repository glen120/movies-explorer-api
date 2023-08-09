const User = require('../models/user');
const code = require('../utils/codes');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');

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
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Произошла ошибка при обновлении профиля'));
      }
      return next(err);
    });
};

module.exports = {
  getUserInfo,
  updateUserInfo,
};