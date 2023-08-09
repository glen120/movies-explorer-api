const users = require('express').Router();
const { getUserInfo, updateUserInfo } = require('../controllers/users');

users.get('users/me', getUserInfo);
users.patch('users/me', updateUserInfo);

module.exports = users;