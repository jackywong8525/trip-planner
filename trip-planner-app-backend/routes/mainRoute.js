const express = require('express');
const router = express.Router();

const {mainAccess} = require('../controllers/mainAppController');
const tripRoute = require('./tripRoute');
const checklistRoute = require('./checklistRoute');

router.use('/trip', tripRoute);
router.use('/checklist', checklistRoute);

// Main Access
router.route('/').get(mainAccess);

module.exports = router;