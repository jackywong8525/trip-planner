const express = require('express');
const router = express.Router();
const { addSchedule, updateSchedule, deleteSchedule } = require('../controllers/scheduleController.js');

router.route('/add-schedule').post(addSchedule);
router.route('/update-schedule').post(updateSchedule);
router.route('/delete-schedule').delete(updateSchedule);

module.exports = router;