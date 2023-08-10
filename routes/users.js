const users = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');
const { updateUserValidator } = require('../middlewares/validation');

users.get('/users/me', getUserInfo);
users.patch('/users/me', updateUserValidator, updateUserInfo);

module.exports = users;
