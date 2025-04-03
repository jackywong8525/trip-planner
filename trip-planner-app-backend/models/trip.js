const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tripSchema = new Schema({
    ownerId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User' 
    },
    name: String,
    location: String,    
    startDate: String,
    endDate: String,
    people: Array,
    isChecklistShared: Boolean
}, { timestamps: true });

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;