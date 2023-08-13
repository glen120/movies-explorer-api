const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const { createUser, login } = require('../controllers/users');
const { signupValidator, signinValidator } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.post('/signup', signupValidator, createUser);
router.post('/signin', signinValidator, login);

router.use(auth, usersRouter);
router.use(auth, moviesRouter);

router.all('*', auth, (req, res, next) => {
  next(new NotFoundError('Ошибочный адрес запроса'));
});

module.exports = router;
