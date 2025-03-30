const express = require('express');
const router = express.Router();

const {mainAccess} = require('../controllers/mainAppController');
const tripRoute = require('./tripRoute');
const { auth } = require('../auth/auth.js');

router.use(auth);
router.use('/trip', tripRoute);

// Main Access
router.route('/').post(mainAccess);

module.exports = router;