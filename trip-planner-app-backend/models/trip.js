const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    name: String,
    location: String,    
    startDate: Date,
    endDate: Date,
    people: Array,
    isScheduleShared: Boolean,
    isChecklistShared: Boolean
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;