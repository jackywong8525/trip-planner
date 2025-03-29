const express = require('express');
const router = express.Router();

const {addTrip} = require('../controllers/tripController');
const scheduleRoute = require('../routes/scheduleRoute.js');

router.use('/schedule', scheduleRoute);
router.route('/add-trip/add-people').post(addTrip);

module.exports = router;