const express = require('express');
const router = express.Router();

const {addTrip, deleteTrip, getOwnedTripsByUserId, getSharedTripsByUserId} = require('../controllers/tripController.js');
const scheduleRoute = require('../routes/scheduleRoute.js');
const checklistRoute = require('./checklistRoute');

router.use('/schedule', scheduleRoute);
router.use('/checklist', checklistRoute);

router.route('/add-trip').post(addTrip);
router.route('/get-owned-trips').post(getOwnedTripsByUserId);
router.route('/get-shared-trips').post(getSharedTripsByUserId);
router.route('/delete-trip').delete(deleteTrip);

module.exports = router;