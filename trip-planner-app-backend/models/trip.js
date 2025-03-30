const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    ownerId: String,
    name: String,
    location: String,    
    startDate: Date,
    endDate: Date,
    people: Array,
    isChecklistShared: Boolean
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;