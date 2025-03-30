const express = require('express');
const router = express.Router();

const {findUsers, addTrip, deleteTrip} = require('../controllers/tripController');
const scheduleRoute = require('../routes/scheduleRoute.js');
const checklistRoute = require('./checklistRoute');

router.use('/schedule', scheduleRoute);
router.use('/checklist', checklistRoute);

router.route('/add-trip').post(addTrip);
router.route('/delete-trip').delete(deleteTrip);
router.route('/add-trip/add-people').post(findUsers);

module.exports = router;