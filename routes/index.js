const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

// router.post('/signup', );

// router.post('/signin', );

router.use(auth, usersRouter);
router.use(auth, moviesRouter);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Ошибочный адрес запроса'));
});

module.exports = router;