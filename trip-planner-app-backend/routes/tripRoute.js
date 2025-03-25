const express = require('express');
const router = express.Router();

const {addTrip} = require('../controllers/tripController');

router.route('/add-trip/add-people').post(addTrip);

module.exports = router;