const express = require('express');
const router = express.Router();

const {addTrip, deleteTrip, getOwnedTripsByUserId, getSharedTripsByUserId, confirmTripInvitation, getTripByTripId} = require('../controllers/tripController.js');
const scheduleRoute = require('../routes/scheduleRoute.js');
const checklistRoute = require('./checklistRoute');

router.use('/schedule', scheduleRoute);
router.use('/checklist', checklistRoute);

router.route('/add-trip').post(addTrip);
router.route('/get-trip-by-tripId').post(getTripByTripId);
router.route('/get-owned-trips').post(getOwnedTripsByUserId);
router.route('/get-shared-trips').post(getSharedTripsByUserId);
router.route('/delete-trip').delete(deleteTrip);
router.route('/confirm-trip-invitation').post(confirmTripInvitation);

module.exports = router;