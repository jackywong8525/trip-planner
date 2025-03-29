const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    tripId: String,
    scheduleItems: Array,
}, { timestamps: true })

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;