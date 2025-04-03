const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
    tripId: { 
        type: Schema.Types.ObjectId, 
        ref: 'Trip' 
    },
    scheduleItems: Array,
}, { timestamps: true })

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;