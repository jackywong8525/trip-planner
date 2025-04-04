const express = require('express');
const router = express.Router();

const {login, register, findUserByUserId, findUsersByUsernameFilter, getActiveUserByToken} = require('../controllers/userController.js');

router.post('/auth/login', login);
router.post('/auth/register', register);
router.post('/find-user-by-userId', findUserByUserId);
router.post('/find-users-by-username-filter', findUsersByUsernameFilter)
router.post('/get-active-user', getActiveUserByToken, findUserByUserId)

module.exports = router;